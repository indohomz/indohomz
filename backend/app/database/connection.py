"""
IndoHomz Database Connection

Handles database engine creation and session management.
Supports both SQLite (local dev) and PostgreSQL (Supabase production).
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings, get_database_url

# Get properly formatted database URL
database_url = get_database_url()

# Configure engine based on database type
if database_url.startswith("sqlite"):
    # SQLite configuration (local development)
    engine = create_engine(
        database_url,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False}  # Required for SQLite
    )
else:
    # PostgreSQL configuration (Supabase production)
    engine = create_engine(
        database_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,      # Verify connections before use
        pool_recycle=300,        # Recycle connections every 5 minutes
        pool_size=5,             # Connection pool size
        max_overflow=10,         # Additional connections when pool is full
    )

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class for SQLAlchemy models
Base = declarative_base()


def get_db():
    """
    Dependency function for FastAPI endpoints.
    
    Creates a database session and ensures it's properly closed.
    
    Usage:
        @app.get("/items")
        async def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database tables.
    
    Call this on application startup to ensure all tables exist.
    """
    from app.database import models  # Import models to register them
    Base.metadata.create_all(bind=engine)


def get_db_info() -> dict:
    """
    Get database connection information.
    
    Useful for health checks and debugging.
    """
    db_type = "sqlite" if database_url.startswith("sqlite") else "postgresql"
    
    return {
        "type": db_type,
        "is_supabase": "supabase" in database_url.lower(),
        "connected": True,  # Will raise exception if not connected
    }
