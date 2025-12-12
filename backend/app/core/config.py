from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import json


class Settings(BaseSettings):
    """
    IndoHomz Application Configuration
    
    Environment variables can be set in .env file or system environment.
    Supabase PostgreSQL is the primary database for production.
    """
    model_config = {"extra": "ignore"}
    
    # ==========================================================================
    # APP INFO
    # ==========================================================================
    APP_NAME: str = "IndoHomz"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Luxury Real Estate PropTech Platform"
    
    # ==========================================================================
    # DATABASE (Supabase PostgreSQL)
    # ==========================================================================
    # For Supabase: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./indohomz.db"  # SQLite for local development
    )
    
    # Direct Supabase client (for storage, realtime, etc.)
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL", None)
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY", None)  # anon/public key
    SUPABASE_SERVICE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_KEY", None)  # service role key
    
    # ==========================================================================
    # SECURITY
    # ==========================================================================
    SECRET_KEY: str = os.getenv("SECRET_KEY", "indohomz-secret-key-change-in-production-2024")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # ==========================================================================
    # AI / LLM CONFIGURATION
    # ==========================================================================
    # OpenAI - for embeddings (vector search) and AI descriptions
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_EMBEDDING_MODEL: str = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    
    # Tavily - for AI report generation (fallback)
    TAVILY_API_KEY: Optional[str] = os.getenv("TAVILY_API_KEY", None)
    
    # ==========================================================================
    # WHATSAPP INTEGRATION (Future)
    # ==========================================================================
    WHATSAPP_API_URL: Optional[str] = os.getenv("WHATSAPP_API_URL", None)
    WHATSAPP_API_TOKEN: Optional[str] = os.getenv("WHATSAPP_API_TOKEN", None)
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = os.getenv("WHATSAPP_PHONE_NUMBER_ID", None)
    
    # ==========================================================================
    # ENVIRONMENT
    # ==========================================================================
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # ==========================================================================
    # CORS
    # ==========================================================================
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins_env = os.getenv("ALLOWED_ORIGINS")
        if origins_env:
            try:
                return json.loads(origins_env)
            except json.JSONDecodeError:
                return origins_env.split(",")
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "https://indohomz.com",
            "https://www.indohomz.com",
            "https://indohomz.vercel.app",
            "https://indohomz-*.vercel.app",  # Preview deployments
        ]
    
    # ==========================================================================
    # FILE UPLOADS (Supabase Storage)
    # ==========================================================================
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    STORAGE_BUCKET: str = "property-images"
    
    # ==========================================================================
    # PAGINATION DEFAULTS
    # ==========================================================================
    DEFAULT_PAGE_SIZE: int = 12
    MAX_PAGE_SIZE: int = 50


# Create settings instance
settings = Settings()


# ==========================================================================
# HELPER FUNCTIONS
# ==========================================================================

def get_database_url() -> str:
    """
    Get the appropriate database URL.
    Handles Supabase connection string formatting if needed.
    """
    url = settings.DATABASE_URL
    
    # Supabase uses 'postgres://' but SQLAlchemy needs 'postgresql://'
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    return url


def is_production() -> bool:
    """Check if running in production environment"""
    return settings.ENVIRONMENT.lower() == "production"


def has_openai() -> bool:
    """Check if OpenAI API is configured"""
    return bool(settings.OPENAI_API_KEY)


def has_supabase() -> bool:
    """Check if Supabase is configured"""
    return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
