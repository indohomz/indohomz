"""
IndoHomz Caching Service

Redis-based caching for properties, analytics, and API responses.
Falls back to in-memory cache if Redis is not available.
"""

import json
from typing import Optional, Any, Callable
from functools import wraps
import hashlib
from datetime import datetime, timedelta

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings

# In-memory cache fallback
_memory_cache = {}
_cache_expiry = {}


class CacheService:
    def __init__(self):
        self.redis_client = None
        self.enabled = settings.REDIS_ENABLED
        
        if self.enabled and REDIS_AVAILABLE:
            try:
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
                # Test connection
                self.redis_client.ping()
                print("✓ Redis cache connected")
            except Exception as e:
                print(f"⚠️ Redis connection failed, using in-memory cache: {e}")
                self.redis_client = None
    
    def _make_key(self, prefix: str, **kwargs) -> str:
        """Generate cache key from parameters"""
        key_parts = [prefix]
        for k, v in sorted(kwargs.items()):
            if v is not None:
                key_parts.append(f"{k}:{v}")
        return ":".join(key_parts)
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.enabled:
            return None
        
        try:
            # Try Redis first
            if self.redis_client:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
            
            # Fallback to memory cache
            if key in _memory_cache:
                if key in _cache_expiry and datetime.now() < _cache_expiry[key]:
                    return _memory_cache[key]
                else:
                    # Expired
                    del _memory_cache[key]
                    if key in _cache_expiry:
                        del _cache_expiry[key]
        except Exception as e:
            print(f"Cache get error: {e}")
        
        return None
    
    def set(self, key: str, value: Any, ttl: int = 300):
        """Set value in cache with TTL (seconds)"""
        if not self.enabled:
            return
        
        try:
            serialized = json.dumps(value, default=str)
            
            # Try Redis first
            if self.redis_client:
                self.redis_client.setex(key, ttl, serialized)
            else:
                # Fallback to memory cache
                _memory_cache[key] = value
                _cache_expiry[key] = datetime.now() + timedelta(seconds=ttl)
        except Exception as e:
            print(f"Cache set error: {e}")
    
    def delete(self, key: str):
        """Delete key from cache"""
        if not self.enabled:
            return
        
        try:
            if self.redis_client:
                self.redis_client.delete(key)
            
            if key in _memory_cache:
                del _memory_cache[key]
            if key in _cache_expiry:
                del _cache_expiry[key]
        except Exception as e:
            print(f"Cache delete error: {e}")
    
    def delete_pattern(self, pattern: str):
        """Delete all keys matching pattern"""
        if not self.enabled:
            return
        
        try:
            if self.redis_client:
                keys = self.redis_client.keys(pattern)
                if keys:
                    self.redis_client.delete(*keys)
            else:
                # Memory cache - delete matching keys
                keys_to_delete = [k for k in _memory_cache.keys() if pattern.replace("*", "") in k]
                for key in keys_to_delete:
                    del _memory_cache[key]
                    if key in _cache_expiry:
                        del _cache_expiry[key]
        except Exception as e:
            print(f"Cache delete pattern error: {e}")
    
    def clear_all(self):
        """Clear entire cache"""
        if not self.enabled:
            return
        
        try:
            if self.redis_client:
                self.redis_client.flushdb()
            
            _memory_cache.clear()
            _cache_expiry.clear()
        except Exception as e:
            print(f"Cache clear error: {e}")


# Global cache instance
cache = CacheService()


# =============================================================================
# CACHE DECORATORS
# =============================================================================

def cached(ttl: int = 300, key_prefix: str = "default"):
    """
    Decorator to cache function results.
    
    Usage:
        @cached(ttl=300, key_prefix="properties")
        def get_properties(city: str):
            return db.query(Property).filter_by(city=city).all()
    """
    def decorator(func: Callable):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Generate cache key from function name and args
            key_parts = [key_prefix, func.__name__]
            
            # Add args to key (skip 'self' and 'db' session)
            for arg in args:
                if not hasattr(arg, '__self__') and arg.__class__.__name__ != 'Session':
                    key_parts.append(str(arg))
            
            # Add kwargs to key
            for k, v in kwargs.items():
                if k != 'db' and v is not None:
                    key_parts.append(f"{k}={v}")
            
            cache_key = ":".join(key_parts)
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Call function and cache result
            result = await func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # Generate cache key
            key_parts = [key_prefix, func.__name__]
            
            for arg in args:
                if not hasattr(arg, '__self__') and arg.__class__.__name__ != 'Session':
                    key_parts.append(str(arg))
            
            for k, v in kwargs.items():
                if k != 'db' and v is not None:
                    key_parts.append(f"{k}={v}")
            
            cache_key = ":".join(key_parts)
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        # Return appropriate wrapper
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    
    return decorator


def invalidate_cache(pattern: str):
    """
    Decorator to invalidate cache after function execution.
    
    Usage:
        @invalidate_cache("properties:*")
        def create_property(data):
            # ... create property
    """
    def decorator(func: Callable):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            cache.delete_pattern(pattern)
            return result
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            cache.delete_pattern(pattern)
            return result
        
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    
    return decorator
