"""
IndoHomz Analytics Router

Provides dashboard analytics and insights.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional
from datetime import datetime, timedelta

from app.database.connection import get_db
from app.database import models
from app.services.crud import property_service, lead_service

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_analytics(db: Session = Depends(get_db)):
    """
    Get comprehensive dashboard analytics.
    
    Returns property stats, lead metrics, and recent activity.
    """
    property_stats = property_service.get_property_stats(db)
    lead_stats = lead_service.get_lead_stats(db)
    
    # Recent properties (last 7 days)
    week_ago = datetime.now() - timedelta(days=7)
    recent_properties = db.query(func.count(models.Property.id)).filter(
        models.Property.created_at >= week_ago
    ).scalar() or 0
    
    # Recent leads (last 7 days)
    recent_leads = db.query(func.count(models.Lead.id)).filter(
        models.Lead.created_at >= week_ago
    ).scalar() or 0
    
    return {
        "overview": {
            "total_properties": property_stats["total_properties"],
            "available_properties": property_stats["available_properties"],
            "rented_properties": property_stats["rented_properties"],
            "total_leads": lead_stats["total_leads"],
            "conversion_rate": lead_stats["conversion_rate"],
        },
        "recent_activity": {
            "new_properties_this_week": recent_properties,
            "new_leads_this_week": recent_leads,
        },
        "property_breakdown": {
            "by_type": property_stats["property_types"],
            "by_location": property_stats["top_locations"],
        },
        "lead_breakdown": {
            "by_status": lead_stats["by_status"],
            "by_source": lead_stats["by_source"],
        },
    }


@router.get("/properties/overview")
async def get_property_analytics(db: Session = Depends(get_db)):
    """
    Get property-specific analytics.
    """
    return property_service.get_property_stats(db)


@router.get("/leads/overview")
async def get_lead_analytics(db: Session = Depends(get_db)):
    """
    Get lead-specific analytics.
    """
    return lead_service.get_lead_stats(db)


@router.get("/properties/price-distribution")
async def get_price_distribution(db: Session = Depends(get_db)):
    """
    Get price distribution of properties.
    
    Returns properties grouped by price ranges.
    """
    # Note: This is simplified - in production you'd parse the price string
    properties = db.query(models.Property).all()
    
    price_ranges = {
        "Under ₹50K": 0,
        "₹50K - ₹1L": 0,
        "₹1L - ₹2L": 0,
        "₹2L - ₹3L": 0,
        "Above ₹3L": 0,
    }
    
    for prop in properties:
        try:
            # Extract numeric value from price string
            price_str = prop.price.replace('₹', '').replace(',', '').replace('/month', '').strip()
            if 'L' in price_str:
                price = float(price_str.replace('L', '')) * 100000
            elif 'K' in price_str:
                price = float(price_str.replace('K', '')) * 1000
            else:
                price = float(price_str)
            
            if price < 50000:
                price_ranges["Under ₹50K"] += 1
            elif price < 100000:
                price_ranges["₹50K - ₹1L"] += 1
            elif price < 200000:
                price_ranges["₹1L - ₹2L"] += 1
            elif price < 300000:
                price_ranges["₹2L - ₹3L"] += 1
            else:
                price_ranges["Above ₹3L"] += 1
        except (ValueError, AttributeError):
            continue
    
    return {
        "distribution": [{"range": k, "count": v} for k, v in price_ranges.items()]
    }


@router.get("/properties/availability-trend")
async def get_availability_trend(
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    """
    Get property availability trend over time.
    """
    # Simplified - in production you'd track historical availability
    total = db.query(func.count(models.Property.id)).scalar() or 0
    available = db.query(func.count(models.Property.id)).filter(
        models.Property.is_available == True
    ).scalar() or 0
    
    return {
        "period_days": days,
        "current_availability_rate": round(available / total * 100, 2) if total > 0 else 0,
        "total_properties": total,
        "available_properties": available,
    }


@router.get("/leads/conversion-funnel")
async def get_conversion_funnel(db: Session = Depends(get_db)):
    """
    Get lead conversion funnel data.
    """
    stats = lead_service.get_lead_stats(db)
    
    stages = ["new", "contacted", "site_visit", "negotiation", "converted"]
    funnel_data = []
    
    for stage in stages:
        count = next((s["count"] for s in stats["by_status"] if s["status"] == stage), 0)
        funnel_data.append({
            "stage": stage.replace("_", " ").title(),
            "count": count,
            "percentage": round(count / stats["total_leads"] * 100, 1) if stats["total_leads"] > 0 else 0
        })
    
    return {
        "funnel": funnel_data,
        "total_leads": stats["total_leads"],
        "overall_conversion_rate": stats["conversion_rate"],
    }


@router.get("/leads/source-performance")
async def get_source_performance(db: Session = Depends(get_db)):
    """
    Get lead source performance metrics.
    """
    stats = lead_service.get_lead_stats(db)
    
    # Calculate conversion rate by source (simplified)
    source_data = []
    for source in stats["by_source"]:
        source_data.append({
            "source": source["source"].replace("_", " ").title(),
            "leads": source["count"],
            "percentage": round(source["count"] / stats["total_leads"] * 100, 1) if stats["total_leads"] > 0 else 0
        })
    
    return {
        "sources": source_data,
        "total_leads": stats["total_leads"],
    }


# Legacy endpoints for backward compatibility
@router.get("/sales-overview")
async def legacy_sales_overview(db: Session = Depends(get_db)):
    """Legacy endpoint - redirects to property analytics"""
    stats = property_service.get_property_stats(db)
    return {
        "total_sales": stats["rented_properties"],
        "total_orders": stats["total_properties"],
        "average_order_value": 0,
        "top_products": [],
        "top_customers": [],
        "sales_by_category": stats["property_types"],
        "sales_trend": [],
    }


@router.get("/inventory-status")
async def legacy_inventory_status(db: Session = Depends(get_db)):
    """Legacy endpoint - returns property availability"""
    stats = property_service.get_property_stats(db)
    return {
        "total_products": stats["total_properties"],
        "low_stock_products": 0,
        "out_of_stock_products": stats["rented_properties"],
        "available": stats["available_properties"],
    }


@router.get("/customer-insights")
async def legacy_customer_insights(db: Session = Depends(get_db)):
    """Legacy endpoint - returns lead analytics"""
    stats = lead_service.get_lead_stats(db)
    return {
        "total_customers": stats["total_leads"],
        "new_customers": stats["new_leads"],
        "conversion_rate": stats["conversion_rate"],
    }
