"""Database initialization script for IndoHomz Real Estate Platform."""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys


def create_database() -> None:
    """Create the ``indohomz_properties`` database if it doesn't exist.

    The connection parameters here are intended for local development. Update
    the host/user/password as needed for your environment or use environment
    variables when deploying.
    """
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host="localhost",
            user="postgres",
            password="password",  # Change this to your PostgreSQL password
            port="5432",
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'indohomz_properties'"
        )
        exists = cursor.fetchone()

        if not exists:
            cursor.execute("CREATE DATABASE indohomz_properties")
            print("✅ Database 'indohomz_properties' created successfully!")
        else:
            print("ℹ️ Database 'indohomz_properties' already exists.")

        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"❌ Error creating database: {e}")
        print("📝 Make sure PostgreSQL is running and credentials are correct")
        sys.exit(1)


if __name__ == "__main__":
    create_database()
