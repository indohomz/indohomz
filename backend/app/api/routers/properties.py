"""
IndoHomz Properties Router

Handles all property listing endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from math import ceil

from app.database.connection import get_db
from app.schemas.schemas import (
    Property, 
    PropertyCreate, 
    PropertyUpdate, 
    PropertyListResponse,
    PropertySearchRequest,
    PropertySearchResponse,
)
from app.services.crud import property_service
from app.core.config import settings

router = APIRouter()


# =============================================================================
# LIST & SEARCH
# =============================================================================

@router.get("/", response_model=PropertyListResponse)
async def get_properties(
    skip: int = Query(0, ge=0, description="Number of properties to skip"),
    limit: int = Query(
        default=settings.DEFAULT_PAGE_SIZE,
        ge=1, 
        le=settings.MAX_PAGE_SIZE,
        description="Max properties to return"
    ),
    is_available: Optional[bool] = Query(None, description="Filter by availability"),
    city: Optional[str] = Query(None, description="Filter by city"),
    location: Optional[str] = Query(None, description="Search in location"),
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    bedrooms: Optional[int] = Query(None, ge=0, description="Minimum bedrooms"),
    db: Session = Depends(get_db)
):
    """
    Get all properties with optional filters.
    
    Returns a paginated list with total count for proper pagination UI.
    """
    properties, total = property_service.get_properties(
        db=db,
        skip=skip,
        limit=limit,
        is_available=is_available,
        city=city,
        location=location,
        property_type=property_type,
        min_bedrooms=bedrooms,
    )
    
    return PropertyListResponse(
        items=properties,
        total=total,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total
    )


@router.get("/featured", response_model=List[Property])
async def get_featured_properties(
    limit: int = Query(6, ge=1, le=12, description="Number of featured properties"),
    db: Session = Depends(get_db)
):
    """
    Get featured properties for homepage display.
    
    Returns the newest available properties.
    """
    return property_service.get_featured_properties(db=db, limit=limit)


@router.get("/available", response_model=List[Property])
async def get_available_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get only available (not rented) properties.
    """
    return property_service.get_available_properties(db=db, skip=skip, limit=limit)


@router.post("/search", response_model=PropertySearchResponse)
async def search_properties(
    search: PropertySearchRequest,
    db: Session = Depends(get_db)
):
    """
    Search properties with text query and filters.
    
    Supports natural language search across title, location, amenities, and description.
    """
    filters = {}
    if search.city:
        filters["city"] = search.city
    if search.property_type:
        filters["property_type"] = search.property_type
    if search.bedrooms is not None:
        filters["bedrooms"] = search.bedrooms
    if search.is_available is not None:
        filters["is_available"] = search.is_available
    
    properties = property_service.search_properties(
        db=db,
        query_text=search.query,
        filters=filters,
        skip=(search.page - 1) * search.page_size,
        limit=search.page_size,
    )
    
    # Get total count for pagination
    total = property_service.get_properties_count(
        db=db,
        is_available=search.is_available,
        city=search.city,
    )
    
    return PropertySearchResponse(
        items=properties,
        total=total,
        page=search.page,
        page_size=search.page_size,
        query=search.query,
        filters_applied=filters,
    )


# =============================================================================
# SINGLE PROPERTY
# =============================================================================

@router.get("/{property_id}", response_model=Property)
async def get_property(
    property_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single property by ID.
    """
    property_obj = property_service.get_property(db=db, property_id=property_id)
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property_obj


@router.get("/slug/{slug}", response_model=Property)
async def get_property_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Get a property by its URL-friendly slug.
    """
    property_obj = property_service.get_property_by_slug(db=db, slug=slug)
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property_obj


# =============================================================================
# CREATE, UPDATE, DELETE
# =============================================================================

@router.post("/", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new property listing.
    """
    return property_service.create_property(db=db, property_data=property_data)


@router.put("/{property_id}", response_model=Property)
async def update_property(
    property_id: int,
    property_update: PropertyUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing property.
    """
    property_obj = property_service.update_property(
        db=db,
        property_id=property_id,
        property_update=property_update
    )
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property_obj


@router.patch("/{property_id}/availability")
async def toggle_property_availability(
    property_id: int,
    is_available: bool,
    db: Session = Depends(get_db)
):
    """
    Quick toggle for property availability status.
    """
    property_obj = property_service.get_property(db=db, property_id=property_id)
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    property_obj.is_available = is_available
    db.commit()
    
    return {"message": f"Property {'available' if is_available else 'unavailable'}", "property_id": property_id}


@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    permanent: bool = Query(False, description="Permanently delete (vs soft delete)"),
    db: Session = Depends(get_db)
):
    """
    Delete a property.
    
    By default, performs a soft delete (marks as unavailable).
    Set permanent=true to completely remove the property.
    """
    if permanent:
        success = property_service.hard_delete_property(db=db, property_id=property_id)
    else:
        success = property_service.delete_property(db=db, property_id=property_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return {"message": "Property deleted successfully", "property_id": property_id}


# =============================================================================
# STATISTICS
# =============================================================================

@router.get("/stats/overview")
async def get_property_stats(db: Session = Depends(get_db)):
    """
    Get property statistics for dashboard.
    """
    return property_service.get_property_stats(db=db)





