import json
import os
import argparse
from pathlib import Path
from dotenv import load_dotenv

from app.database.connection import SessionLocal, engine, Base
from app.database import models


def load_env(env_path: str = None):
    if env_path and Path(env_path).exists():
        load_dotenv(env_path)
    else:
        # Try project .env
        load_dotenv()


def seed_from_file(file_path: str):
    if not Path(file_path).exists():
        print(f"Data file not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    Session = SessionLocal
    db = Session()
    try:
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)

        count = 0
        for item in data:
            title = item.get("title") or item.get("name") or item.get("property_title") or "Untitled"
            price = str(item.get("price") or item.get("rent") or "0")
            image = item.get("image") or item.get("image_url") or item.get("photo")
            location = item.get("location") or "Gurgaon"
            amenities = item.get("amenities") or item.get("features") or "Wifi, AC, Power Backup"

            prop = models.Property(
                title=title,
                price=price,
                location=location,
                image_url=image,
                amenities=amenities,
                is_available=True
            )
            db.add(prop)
            count += 1

        db.commit()
        print(f"✅ Seeded {count} properties from {file_path}")
    except Exception as e:
        db.rollback()
        print(f"Error while seeding: {e}")
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Seed the database with properties from JSON")
    parser.add_argument("--file", "-f", default="../indohomz-scraper/database.json", help="Path to JSON file")
    parser.add_argument("--env", help="Path to .env file to load (optional)")
    args = parser.parse_args()

    load_env(args.env)
    seed_from_file(args.file)


if __name__ == "__main__":
    main()
