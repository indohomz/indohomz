#!/usr/bin/env python3
"""
IndoHomz Database Seeder

Populates the database with property data from database.json.
Run this script after setting up your database connection.

Usage:
    python seed_db.py                    # Seed from database.json
    python seed_db.py --file custom.json # Seed from custom file
    python seed_db.py --clear            # Clear all properties first
"""

import json
import sys
import os
import re
import argparse
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.database.connection import engine, SessionLocal
from app.database.models import Base, Property


# Sample high-quality images for properties (Unsplash)
PROPERTY_IMAGES = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",  # Modern house
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",  # Luxury villa
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",  # Contemporary home
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",  # Modern apartment
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",  # Penthouse
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",  # Interior
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",  # Bedroom
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",  # Living room
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",    # Apartment
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",  # Suburban home
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",  # House exterior
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",  # Colorful house
]


def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug


def detect_property_type(title: str) -> str:
    """Detect property type from title"""
    title_lower = title.lower()
    if 'villa' in title_lower or 'bungalow' in title_lower:
        return 'villa'
    elif 'penthouse' in title_lower:
        return 'penthouse'
    elif 'studio' in title_lower:
        return 'studio'
    elif 'pg' in title_lower or 'shared' in title_lower:
        return 'pg'
    elif 'house' in title_lower or 'home' in title_lower:
        return 'independent_house'
    elif 'farmhouse' in title_lower or 'countryside' in title_lower:
        return 'farmhouse'
    else:
        return 'apartment'


def detect_bedrooms(title: str) -> int | None:
    """Detect bedrooms from title"""
    title_lower = title.lower()
    if 'studio' in title_lower:
        return 0
    elif '1bhk' in title_lower or '1 bhk' in title_lower:
        return 1
    elif '2bhk' in title_lower or '2 bhk' in title_lower:
        return 2
    elif '3bhk' in title_lower or '3 bhk' in title_lower:
        return 3
    elif '4bhk' in title_lower or '4 bhk' in title_lower:
        return 4
    elif 'penthouse' in title_lower or 'villa' in title_lower:
        return 3  # Default for luxury properties
    return None


def generate_description(property_data: dict) -> str:
    """Generate a marketing description for the property"""
    title = property_data.get('title', 'Property')
    amenities = property_data.get('amenities', '')
    location = property_data.get('location', 'Gurgaon')
    
    amenity_list = [a.strip() for a in amenities.split(',')]
    amenity_text = ', '.join(amenity_list[:3]) if amenity_list else 'modern amenities'
    
    descriptions = [
        f"Experience luxury living at {title}. This stunning property in {location} offers {amenity_text} and more. Perfect for professionals and families seeking premium accommodation.",
        f"Welcome to {title} - your next home in {location}. Featuring {amenity_text}, this property combines comfort with style. Schedule a visit today!",
        f"Discover {title}, a premium residence in the heart of {location}. Enjoy {amenity_text} in this beautifully designed space. Ideal for those who appreciate quality living.",
        f"{title} offers an exceptional living experience in {location}. With {amenity_text}, this property is designed for modern lifestyles. Book your tour now!",
    ]
    
    import random
    return random.choice(descriptions)


def format_price(price_value: str) -> str:
    """Format price as Indian Rupees"""
    try:
        amount = int(price_value)
        if amount >= 100000:
            return f"₹{amount/100000:.1f}L/month"
        else:
            return f"₹{amount:,}/month"
    except (ValueError, TypeError):
        return f"₹{price_value}"


def clear_properties(db: Session):
    """Clear all existing properties"""
    count = db.query(Property).delete()
    db.commit()
    print(f"🗑️  Cleared {count} existing properties")


def seed_properties(db: Session, data: list, use_images: bool = True):
    """Seed properties from JSON data"""
    created_count = 0
    skipped_count = 0
    
    for i, item in enumerate(data):
        # Check if property already exists (by title)
        existing = db.query(Property).filter(
            Property.title == item.get('title')
        ).first()
        
        if existing:
            skipped_count += 1
            continue
        
        # Generate slug
        base_slug = generate_slug(item.get('title', f'property-{i}'))
        slug = base_slug
        counter = 1
        while db.query(Property).filter(Property.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Determine property attributes
        property_type = detect_property_type(item.get('title', ''))
        bedrooms = detect_bedrooms(item.get('title', ''))
        
        # Assign image URL
        image_url = item.get('image_url')
        if not image_url and use_images:
            image_url = PROPERTY_IMAGES[i % len(PROPERTY_IMAGES)]
        
        # Create property
        property_obj = Property(
            title=item.get('title', f'Property {i+1}'),
            slug=slug,
            price=format_price(item.get('price', '0')),
            location=item.get('location', 'Gurgaon'),
            city=item.get('city', 'Gurgaon'),
            area=item.get('area'),
            property_type=property_type,
            bedrooms=bedrooms,
            bathrooms=bedrooms if bedrooms else 1,  # Assume 1 bathroom per bedroom
            furnishing='furnished',
            image_url=image_url,
            amenities=item.get('amenities', 'Wifi, AC, Power Backup'),
            description=generate_description(item),
            is_available=item.get('is_available', True),
        )
        
        db.add(property_obj)
        created_count += 1
    
    db.commit()
    return created_count, skipped_count


def main():
    parser = argparse.ArgumentParser(description='Seed IndoHomz database with properties')
    parser.add_argument('--file', type=str, default='database.json', help='JSON file to load')
    parser.add_argument('--clear', action='store_true', help='Clear existing properties before seeding')
    parser.add_argument('--no-images', action='store_true', help='Skip assigning placeholder images')
    args = parser.parse_args()
    
    print("🏠 IndoHomz Database Seeder")
    print("=" * 40)
    
    # Create tables if they don't exist
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Load JSON data
    json_path = Path(__file__).parent / args.file
    if not json_path.exists():
        # Try root directory
        json_path = Path(__file__).parent.parent / args.file
    
    if not json_path.exists():
        print(f"❌ Error: Could not find {args.file}")
        print(f"   Searched: {json_path}")
        sys.exit(1)
    
    print(f"📂 Loading data from: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"📋 Found {len(data)} properties in JSON file")
    
    # Create database session
    db = SessionLocal()
    
    try:
        if args.clear:
            clear_properties(db)
        
        # Seed properties
        created, skipped = seed_properties(db, data, use_images=not args.no_images)
        
        print("=" * 40)
        print(f"✅ Created: {created} properties")
        if skipped:
            print(f"⏭️  Skipped: {skipped} (already exist)")
        
        # Show summary
        total = db.query(Property).count()
        available = db.query(Property).filter(Property.is_available == True).count()
        print(f"📊 Total in database: {total} properties ({available} available)")
        
        print("\n🎉 Database seeding complete!")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
