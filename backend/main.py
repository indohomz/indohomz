"""
IndoHomz API - Luxury Real Estate PropTech Platform

FastAPI backend for property listings, lead management, and AI-powered search.
"""

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from sqlalchemy import text
import uvicorn
from datetime import datetime
import time

# Import routers
from app.api.routers import properties, leads, analytics, reports, maps
from app.database.connection import get_db, engine
from app.database import models
from app.core.config import settings, get_database_url
from app.core.rate_limit import init_rate_limiting
from app.core.cache import cache


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("=" * 50)
    print(f"🏠 Starting {settings.APP_NAME} API v{settings.APP_VERSION}")
    print("=" * 50)
    print(f"   Environment: {settings.ENVIRONMENT}")
    print(f"   Debug Mode: {settings.DEBUG}")
    print(f"   Database: {'Supabase' if 'supabase' in settings.DATABASE_URL else 'SQLite (local)'}")
    print(f"   OpenAI: {'✓ Configured' if settings.OPENAI_API_KEY else '✗ Not configured'}")
    print(f"   reCAPTCHA: {'✓ Enabled' if settings.RECAPTCHA_ENABLED else '✗ Disabled'}")
    print(f"   Google Maps: {'✓ Configured' if settings.GOOGLE_MAPS_API_KEY else '✗ Not configured'}")
    print(f"   Redis Cache: {'✓ Enabled' if settings.REDIS_ENABLED else '✗ Disabled (using in-memory)'}")
    print("=" * 50)
    
    # Create database tables
    try:
        models.Base.metadata.create_all(bind=engine)
        print("✓ Database tables ready")
    except Exception as e:
        print(f"✗ Database initialization error: {e}")
    
    # Initialize rate limiting
    init_rate_limiting()
    print("✓ Rate limiting initialized")
    
    yield
    
    # Shutdown
    print(f"👋 Shutting down {settings.APP_NAME} API...")


# Initialize FastAPI app
app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Security headers
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Process-Time"] = str(process_time)
    
    return response


# =============================================================================
# ROUTERS
# =============================================================================

# Property routes (main feature)
app.include_router(
    properties.router, 
    prefix="/api/v1/properties", 
    tags=["properties"]
)

# Lead/Inquiry routes
app.include_router(
    leads.router, 
    prefix="/api/v1/leads", 
    tags=["leads"]
)

# Analytics routes
app.include_router(
    analytics.router, 
    prefix="/api/v1/analytics", 
    tags=["analytics"]
)

# AI Reports routes
app.include_router(
    reports.router, 
    prefix="/api/v1/reports", 
    tags=["reports"]
)

# Maps proxy routes
app.include_router(
    maps.router, 
    prefix="/api/v1/maps", 
    tags=["maps"]
)


# =============================================================================
# ROOT ENDPOINTS
# =============================================================================

@app.get("/", tags=["root"])
async def root():
    """API root - welcome message and info"""
    return {
        "name": settings.APP_NAME,
        "tagline": "Luxury Real Estate PropTech Platform",
        "version": settings.APP_VERSION,
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "docs": "/docs",
            "properties": "/api/v1/properties",
            "leads": "/api/v1/leads",
            "analytics": "/api/v1/analytics",
            "reports": "/api/v1/reports",
        }
    }


@app.get("/health", tags=["health"])
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint - verifies API and database status"""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "operational",
            "database": db_status,
            "ai": "configured" if settings.OPENAI_API_KEY else "not_configured",
        },
        "version": settings.APP_VERSION,
    }


@app.get("/api/v1", tags=["root"])
async def api_info():
    """API version info"""
    return {
        "api_version": "v1",
        "app": settings.APP_NAME,
        "description": settings.APP_DESCRIPTION,
    }


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG,
    )
