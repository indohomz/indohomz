from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.database import models
from app.schemas.schemas import Property, PropertyCreate, PropertyUpdate
from app.services.crud import product_service

router = APIRouter()

@router.get("/", response_model=List[Property])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all properties"""
    products = product_service.get_products(
        db=db, 
        skip=skip, 
        limit=limit, 
        category=category, 
        is_active=is_active
    )
    return products

@router.get("/{property_id}", response_model=Property)
async def get_product(property_id: int, db: Session = Depends(get_db)):
    """Get a specific property by ID"""
    product = product_service.get_product(db=db, product_id=property_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return product

@router.post("/", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_product(product: PropertyCreate, db: Session = Depends(get_db)):
    """Create a new property"""
    return product_service.create_product(db=db, product=product)

@router.put("/{property_id}", response_model=Property)
async def update_product(
    property_id: int,
    product_update: PropertyUpdate,
    db: Session = Depends(get_db)
):
    """Update a property"""
    product = product_service.get_product(db=db, product_id=property_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    return product_service.update_product(
        db=db,
        product_id=property_id,
        product_update=product_update
    )

@router.delete("/{property_id}")
async def delete_product(property_id: int, db: Session = Depends(get_db)):
    """Mark a property as unavailable"""
    product = product_service.get_product(db=db, product_id=property_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    product_service.delete_product(db=db, product_id=property_id)
    return {"message": "Property marked unavailable"}

@router.get("/category/{category}", response_model=List[Property])
async def get_products_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get products by category"""
    products = product_service.get_products_by_category(
        db=db, 
        category=category, 
        skip=skip, 
        limit=limit
    )
    return products

@router.get("/low-stock/alert")
async def get_low_stock_products(db: Session = Depends(get_db)):
    """Placeholder: low-stock alerts are not applicable for properties"""
    return {"count": 0, "products": []}
