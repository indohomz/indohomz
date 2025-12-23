"""
IndoHomz CRUD Services
Handles all database operations for properties, leads, and bookings.
"""

from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_, func, desc, select
from typing import List, Optional, Dict, Tuple
from datetime import datetime
import re

from app.database import models
from app.schemas import schemas
from app.core.cache import cache, cached, invalidate_cache
from app.core.config import settings


def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug


# =============================================================================
# PROPERTY SERVICE
# =============================================================================

class PropertyService:
    """Service for Property CRUD operations"""
    
    def get_property(self, db: Session, property_id: int) -> Optional[models.Property]:
        """Get a single property by ID"""
        return db.query(models.Property).filter(models.Property.id == property_id).first()
    
    def get_property_by_slug(self, db: Session, slug: str) -> Optional[models.Property]:
        """Get a property by its URL slug"""
        return db.query(models.Property).filter(models.Property.slug == slug).first()
    
    def get_properties(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 12,
        is_available: Optional[bool] = None,
        city: Optional[str] = None,
        location: Optional[str] = None,
        property_type: Optional[str] = None,
        min_bedrooms: Optional[int] = None,
        max_price: Optional[int] = None,
    ) -> Tuple[List[models.Property], int]:
        """Get properties with optional filters and total count (with caching)"""
        
        # Generate cache key
        cache_key = cache._make_key(
            "properties:list",
            skip=skip,
            limit=limit,
            available=is_available,
            city=city,
            location=location,
            type=property_type,
            bedrooms=min_bedrooms,
            price=max_price
        )
        
        # Try cache first
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result["items"], cached_result["total"]
        
        # Build query with eager loading to prevent N+1
        query = db.query(models.Property)
        count_query = db.query(func.count(models.Property.id))
        
        if is_available is not None:
            query = query.filter(models.Property.is_available == is_available)
            count_query = count_query.filter(models.Property.is_available == is_available)
        if city:
            query = query.filter(models.Property.city.ilike(f"%{city}%"))
            count_query = count_query.filter(models.Property.city.ilike(f"%{city}%"))
        if location:
            query = query.filter(models.Property.location.ilike(f"%{location}%"))
            count_query = count_query.filter(models.Property.location.ilike(f"%{location}%"))
        if property_type:
            query = query.filter(models.Property.property_type == property_type)
            count_query = count_query.filter(models.Property.property_type == property_type)
        if min_bedrooms is not None:
            query = query.filter(models.Property.bedrooms >= min_bedrooms)
            count_query = count_query.filter(models.Property.bedrooms >= min_bedrooms)
        
        # Get total count
        total = count_query.scalar() or 0
        
        # Order by newest first
        query = query.order_by(desc(models.Property.created_at))
        items = query.offset(skip).limit(limit).all()
        
        # Cache result
        result = {"items": items, "total": total}
        cache.set(cache_key, result, ttl=settings.CACHE_TTL_PROPERTIES)
        
        return items, total
    
    def get_properties_count(
        self,
        db: Session,
        is_available: Optional[bool] = None,
        city: Optional[str] = None,
    ) -> int:
        """Get total count of properties with filters"""
        query = db.query(func.count(models.Property.id))
        
        if is_available is not None:
            query = query.filter(models.Property.is_available == is_available)
        if city:
            query = query.filter(models.Property.city.ilike(f"%{city}%"))
        
        return query.scalar() or 0
    
    def get_available_properties(self, db: Session, skip: int = 0, limit: int = 12):
        """Get only available properties (with caching)"""
        return self.get_properties(db, skip=skip, limit=limit, is_available=True)
    
    @cached(ttl=300, key_prefix="properties:featured")
    def get_featured_properties(self, db: Session, limit: int = 6) -> List[models.Property]:
        """Get featured/highlighted properties for homepage (cached)"""
        return db.query(models.Property).filter(
            models.Property.is_available == True
        ).order_by(desc(models.Property.created_at)).limit(limit).all()
    
    def search_properties(
        self,
        db: Session,
        query_text: Optional[str] = None,
        filters: Optional[dict] = None,
        skip: int = 0,
        limit: int = 12,
    ) -> List[models.Property]:
        """Search properties by text and filters"""
        query = db.query(models.Property)
        
        # Text search across multiple fields
        if query_text:
            search_term = f"%{query_text}%"
            query = query.filter(
                or_(
                    models.Property.title.ilike(search_term),
                    models.Property.location.ilike(search_term),
                    models.Property.area.ilike(search_term),
                    models.Property.amenities.ilike(search_term),
                    models.Property.description.ilike(search_term),
                )
            )
        
        # Apply additional filters
        if filters:
            if filters.get("city"):
                query = query.filter(models.Property.city.ilike(f"%{filters['city']}%"))
            if filters.get("property_type"):
                query = query.filter(models.Property.property_type == filters["property_type"])
            if filters.get("bedrooms"):
                query = query.filter(models.Property.bedrooms == filters["bedrooms"])
            if filters.get("is_available") is not None:
                query = query.filter(models.Property.is_available == filters["is_available"])
        
        return query.offset(skip).limit(limit).all()
    
    @invalidate_cache("properties:*")
    def create_property(self, db: Session, property_data: schemas.PropertyCreate) -> models.Property:
        """Create a new property (invalidates cache)"""
        data = property_data.model_dump()
        
        # Generate slug from title
        base_slug = generate_slug(data.get("title", "property"))
        slug = base_slug
        counter = 1
        
        # Ensure unique slug
        while self.get_property_by_slug(db, slug):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        db_property = models.Property(**data, slug=slug)
        db.add(db_property)
        db.commit()
        db.refresh(db_property)
        return db_property
    
    @invalidate_cache("properties:*")
    def update_property(
        self,
        db: Session,
        property_id: int,
        property_update: schemas.PropertyUpdate
    ) -> Optional[models.Property]:
        """Update an existing property (invalidates cache)"""
        db_property = self.get_property(db, property_id)
        if not db_property:
            return None
        
        update_data = property_update.model_dump(exclude_unset=True)
        
        # Update slug if title changed
        if "title" in update_data:
            update_data["slug"] = generate_slug(update_data["title"])
        
        for field, value in update_data.items():
            setattr(db_property, field, value)
        
        db.commit()
        db.refresh(db_property)
    @invalidate_cache("properties:*")
    def delete_property(self, db: Session, property_id: int) -> bool:
        """Soft delete a property (mark as unavailable, invalidates cache)"""
        db_property = self.get_property(db, property_id)
        if not db_property:
            return False
        
        db_property.is_available = False
        db.commit()
        return True
    
    @invalidate_cache("properties:*")
    def hard_delete_property(self, db: Session, property_id: int) -> bool:
        """Permanently delete a property (invalidates cache)"""
        db_property = self.get_property(db, property_id)
        if not db_property:
            return False
        
        db.delete(db_property)
        db.commit()
        return True
    
    @cached(ttl=600, key_prefix="properties:stats")
    def get_property_stats(self, db: Session) -> dict:
        """Get property statistics for dashboard (cached)"""
        total = db.query(func.count(models.Property.id)).scalar() or 0
        available = db.query(func.count(models.Property.id)).filter(
            models.Property.is_available == True
        ).scalar() or 0
        
        # Property type distribution
        type_dist = db.query(
            models.Property.property_type,
            func.count(models.Property.id).label("count")
        ).group_by(models.Property.property_type).all()
        
        # Location distribution
        location_dist = db.query(
            models.Property.city,
            func.count(models.Property.id).label("count")
        ).group_by(models.Property.city).order_by(desc("count")).limit(5).all()
        
        return {
            "total_properties": total,
            "available_properties": available,
            "rented_properties": total - available,
            "property_types": [{"type": t, "count": c} for t, c in type_dist],
            "top_locations": [{"city": c, "count": cnt} for c, cnt in location_dist],
        }


# =============================================================================
# LEAD SERVICE
# =============================================================================

class LeadService:
    """Service for Lead/Inquiry CRUD operations"""
    
    def get_lead(self, db: Session, lead_id: int) -> Optional[models.Lead]:
        """Get a single lead by ID"""
        return db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    
    def get_leads(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None,
        source: Optional[str] = None,
    ) -> List[models.Lead]:
        """Get leads with optional filters"""
        query = db.query(models.Lead)
        
        if status:
            query = query.filter(models.Lead.status == status)
        if source:
            query = query.filter(models.Lead.source == source)
        
        return query.order_by(desc(models.Lead.created_at)).offset(skip).limit(limit).all()
    
    def get_leads_by_property(self, db: Session, property_id: int) -> List[models.Lead]:
        """Get all leads for a specific property"""
        return db.query(models.Lead).filter(
            models.Lead.property_id == property_id
        ).order_by(desc(models.Lead.created_at)).all()
    
    def create_lead(self, db: Session, lead_data: schemas.LeadCreate) -> models.Lead:
        """Create a new lead/inquiry"""
        db_lead = models.Lead(**lead_data.model_dump(), status="new")
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        return db_lead
    
    def update_lead(
        self,
        db: Session,
        lead_id: int,
        lead_update: schemas.LeadUpdate
    ) -> Optional[models.Lead]:
        """Update a lead"""
        db_lead = self.get_lead(db, lead_id)
        if not db_lead:
            return None
        
        update_data = lead_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_lead, field, value)
        
        db.commit()
        db.refresh(db_lead)
        return db_lead
    
    def update_lead_status(self, db: Session, lead_id: int, status: str) -> Optional[models.Lead]:
        """Quick update just the lead status"""
        db_lead = self.get_lead(db, lead_id)
        if not db_lead:
            return None
        
        db_lead.status = status
        db.commit()
        db.refresh(db_lead)
        return db_lead
    
    def get_lead_stats(self, db: Session) -> dict:
        """Get lead statistics for dashboard"""
        total = db.query(func.count(models.Lead.id)).scalar() or 0
        
        # Status distribution
        status_dist = db.query(
            models.Lead.status,
            func.count(models.Lead.id).label("count")
        ).group_by(models.Lead.status).all()
        
        # Source distribution
        source_dist = db.query(
            models.Lead.source,
            func.count(models.Lead.id).label("count")
        ).group_by(models.Lead.source).all()
        
        # Calculate conversion rate
        converted = db.query(func.count(models.Lead.id)).filter(
            models.Lead.status == "converted"
        ).scalar() or 0
        
        return {
            "total_leads": total,
            "new_leads": next((c for s, c in status_dist if s == "new"), 0),
            "converted_leads": converted,
            "conversion_rate": round((converted / total * 100) if total > 0 else 0, 2),
            "by_status": [{"status": s, "count": c} for s, c in status_dist],
            "by_source": [{"source": s, "count": c} for s, c in source_dist],
        }


# =============================================================================
# BOOKING SERVICE
# =============================================================================

class BookingService:
    """Service for Booking CRUD operations"""
    
    def get_booking(self, db: Session, booking_id: int) -> Optional[models.Booking]:
        """Get a single booking by ID"""
        return db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    
    def get_bookings(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None,
    ) -> List[models.Booking]:
        """Get bookings with optional filters"""
        query = db.query(models.Booking)
        
        if status:
            query = query.filter(models.Booking.status == status)
        
        return query.order_by(desc(models.Booking.created_at)).offset(skip).limit(limit).all()
    
    def get_bookings_by_property(self, db: Session, property_id: int) -> List[models.Booking]:
        """Get all bookings for a specific property"""
        return db.query(models.Booking).filter(
            models.Booking.property_id == property_id
        ).order_by(desc(models.Booking.created_at)).all()
    
    def create_booking(self, db: Session, booking_data: schemas.BookingCreate) -> models.Booking:
        """Create a new booking"""
        # Mark property as unavailable
        property_obj = db.query(models.Property).filter(
            models.Property.id == booking_data.property_id
        ).first()
        if property_obj:
            property_obj.is_available = False
        
        db_booking = models.Booking(**booking_data.model_dump(), status="confirmed")
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        return db_booking
    
    def update_booking(
        self,
        db: Session,
        booking_id: int,
        booking_update: schemas.BookingUpdate
    ) -> Optional[models.Booking]:
        """Update a booking"""
        db_booking = self.get_booking(db, booking_id)
        if not db_booking:
            return None
        
        update_data = booking_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_booking, field, value)
        
        db.commit()
        db.refresh(db_booking)
        return db_booking
    
    def cancel_booking(self, db: Session, booking_id: int) -> Optional[models.Booking]:
        """Cancel a booking and make property available again"""
        db_booking = self.get_booking(db, booking_id)
        if not db_booking:
            return None
        
        db_booking.status = "cancelled"
        
        # Make property available again
        property_obj = db.query(models.Property).filter(
            models.Property.id == db_booking.property_id
        ).first()
        if property_obj:
            property_obj.is_available = True
        
        db.commit()
        db.refresh(db_booking)
        return db_booking


# =============================================================================
# SERVICE INSTANCES (for backward compatibility with existing routers)
# =============================================================================

property_service = PropertyService()
lead_service = LeadService()
booking_service = BookingService()

# Legacy alias for existing routers that use product_service
product_service = property_service
