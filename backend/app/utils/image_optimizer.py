"""
IndoHomz Image Optimization Utilities (Phase 3)

Utilities for image optimization, CDN integration, and responsive images.
Future: Integrate with Cloudinary or Supabase Storage for automatic optimization.
"""

from typing import Optional, List, Dict
import hashlib
import re


def optimize_image_url(
    url: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    quality: int = 80,
    format: str = "webp"
) -> str:
    """
    Generate optimized image URL with transformations.
    
    For now, returns original URL. When CDN is integrated (Cloudinary/Supabase),
    this will append transformation parameters.
    
    Args:
        url: Original image URL
        width: Target width in pixels
        height: Target height in pixels
        quality: Image quality (1-100)
        format: Target format (webp, jpg, png)
    
    Returns:
        Optimized image URL
    """
    # TODO Phase 3: Add Cloudinary transformations
    # Example: https://res.cloudinary.com/demo/image/upload/w_300,h_200,q_80,f_webp/sample.jpg
    return url


def generate_responsive_srcset(url: str, widths: List[int] = None) -> str:
    """
    Generate srcset attribute for responsive images.
    
    Args:
        url: Base image URL
        widths: List of image widths to generate [640, 768, 1024, 1280]
    
    Returns:
        srcset string for HTML img tag
    """
    if widths is None:
        widths = [640, 768, 1024, 1280, 1536]
    
    srcset_parts = []
    for width in widths:
        optimized_url = optimize_image_url(url, width=width)
        srcset_parts.append(f"{optimized_url} {width}w")
    
    return ", ".join(srcset_parts)


def get_image_cache_key(url: str, transformations: Dict) -> str:
    """Generate cache key for image transformations"""
    key_data = f"{url}:{transformations}"
    return f"image:{hashlib.md5(key_data.encode()).hexdigest()}"


def validate_image_url(url: str) -> bool:
    """Validate image URL format and extension"""
    if not url:
        return False
    
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    return any(url.lower().endswith(ext) for ext in valid_extensions)


def extract_image_urls(images_json: Optional[str]) -> List[str]:
    """
    Extract image URLs from JSON string.
    
    Args:
        images_json: JSON string containing image URLs
    
    Returns:
        List of image URLs
    """
    if not images_json:
        return []
    
    try:
        import json
        images = json.loads(images_json)
        if isinstance(images, list):
            return [url for url in images if validate_image_url(url)]
    except:
        pass
    
    return []


# =============================================================================
# CDN INTEGRATION PLACEHOLDERS (For Phase 3 completion)
# =============================================================================

class ImageCDN:
    """
    CDN integration for image hosting and optimization.
    
    Supports:
    - Cloudinary (https://cloudinary.com/)
    - Supabase Storage (https://supabase.com/docs/guides/storage)
    - Custom CDN
    """
    
    def __init__(self, provider: str = "local"):
        self.provider = provider
        self.base_url = ""
    
    def upload_image(self, file_path: str) -> str:
        """Upload image to CDN and return URL"""
        # TODO: Implement CDN upload
        return file_path
    
    def delete_image(self, url: str) -> bool:
        """Delete image from CDN"""
        # TODO: Implement CDN deletion
        return True
    
    def get_optimized_url(self, url: str, **transformations) -> str:
        """Get optimized image URL with transformations"""
        return optimize_image_url(url, **transformations)


# Global CDN instance
image_cdn = ImageCDN(provider="local")
