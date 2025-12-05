"""Alembic env.py tailored to the IndoHomz project.
This file imports the SQLAlchemy `Base` from `backend.models` and uses the
`DATABASE_URL` environment variable. It supports both sync (psycopg2) and async
(asyncpg) URLs.
"""
from __future__ import annotations
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# Make sure backend package is importable when alembic runs from project root
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import your models' MetaData object here
try:
    from backend.models import Base
except Exception as e:
    raise RuntimeError(f"Could not import backend.models: {e}")

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Get DB URL from env var if provided, otherwise fall back to alembic.ini
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = config.get_main_option("sqlalchemy.url")

# add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (no DB connection required)."""
    url = DATABASE_URL or "sqlite:///:memory:"
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (with live DB connection)."""
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable must be set for online migrations")

    # Strip async driver for autogenerate if using asyncpg
    sync_url = DATABASE_URL.replace("+asyncpg", "") if "+asyncpg" in DATABASE_URL else DATABASE_URL
    
    engine = create_engine(sync_url, poolclass=pool.NullPool)

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# If running with --offline flag or DATABASE_URL not set, use offline mode
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
