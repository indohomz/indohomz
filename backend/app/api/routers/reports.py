"""
IndoHomz Reports Router

AI-powered report generation for property and lead analytics.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database.connection import get_db
from app.database import models
from app.schemas.schemas import ReportRequest, ReportResponse, ReportType
from app.services.genai_service import GenAIService
from app.services.crud import property_service, lead_service

router = APIRouter()
genai_service = GenAIService()


@router.post("/generate", response_model=ReportResponse)
async def generate_report(
    request: ReportRequest,
    db: Session = Depends(get_db)
):
    """Generate an AI-powered natural language report"""
    try:
        # Get data based on report type
        data = await get_report_data(db, request)
        
        # Generate report using GenAI
        report = await genai_service.generate_report(request.report_type.value, data)
        
        return ReportResponse(
            report_type=request.report_type.value,
            summary=report["summary"],
            detailed_analysis=report["detailed_analysis"],
            recommendations=report["recommendations"],
            generated_at=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )


@router.get("/types")
async def get_report_types():
    """Get available report types"""
    return [
        {
            "type": "property_overview",
            "name": "Property Overview",
            "description": "Comprehensive overview of property listings and availability"
        },
        {
            "type": "availability_status",
            "name": "Availability Status",
            "description": "Current availability levels and rental status"
        },
        {
            "type": "lead_insights",
            "name": "Lead Insights",
            "description": "Lead behavior analysis and conversion insights"
        },
        {
            "type": "listing_performance",
            "name": "Listing Performance",
            "description": "Property listing performance and engagement metrics"
        },
        {
            "type": "market_analysis",
            "name": "Market Analysis",
            "description": "Market trends and pricing analysis"
        }
    ]


@router.post("/ask")
async def ask_business_question(
    question: str,
    db: Session = Depends(get_db)
):
    """Ask a natural language question about the business data"""
    try:
        # Get relevant data context
        context = await get_business_context(db)
        
        # Generate answer using GenAI
        answer = await genai_service.answer_question(question, context)
        
        return {
            "question": question,
            "answer": answer,
            "generated_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to answer question: {str(e)}"
        )


async def get_report_data(db: Session, request: ReportRequest):
    """Get data based on report type and filters"""
    
    # Default date range if not provided
    end_date = request.end_date or datetime.now()
    start_date = request.start_date or (end_date - timedelta(days=30))
    
    if request.report_type == ReportType.PROPERTY_OVERVIEW:
        return await get_property_overview_data(db)
    
    elif request.report_type == ReportType.AVAILABILITY_STATUS:
        return await get_availability_data(db)
    
    elif request.report_type == ReportType.LEAD_INSIGHTS:
        return await get_lead_insights_data(db, start_date, end_date)
    
    elif request.report_type == ReportType.LISTING_PERFORMANCE:
        return await get_listing_performance_data(db, start_date, end_date)
    
    elif request.report_type == ReportType.MARKET_ANALYSIS:
        return await get_market_analysis_data(db)
    
    else:
        raise ValueError(f"Unknown report type: {request.report_type}")


async def get_property_overview_data(db: Session):
    """Get property overview data for report"""
    
    # Total properties
    total = db.query(func.count(models.Property.id)).scalar() or 0
    available = db.query(func.count(models.Property.id)).filter(
        models.Property.is_available == True
    ).scalar() or 0
    
    # Property types distribution
    type_dist = db.query(
        models.Property.property_type,
        func.count(models.Property.id).label("count")
    ).group_by(models.Property.property_type).all()
    
    # Location distribution
    location_dist = db.query(
        models.Property.city,
        func.count(models.Property.id).label("count")
    ).group_by(models.Property.city).all()
    
    return {
        "total_properties": total,
        "available_properties": available,
        "rented_properties": total - available,
        "occupancy_rate": round((total - available) / total * 100, 2) if total > 0 else 0,
        "property_types": [{"type": t or "Unknown", "count": c} for t, c in type_dist],
        "locations": [{"city": c or "Unknown", "count": cnt} for c, cnt in location_dist],
    }


async def get_availability_data(db: Session):
    """Get availability status data for report"""
    
    # Current availability
    total = db.query(func.count(models.Property.id)).scalar() or 0
    available = db.query(func.count(models.Property.id)).filter(
        models.Property.is_available == True
    ).scalar() or 0
    
    # Properties by type and availability
    availability_by_type = db.query(
        models.Property.property_type,
        models.Property.is_available,
        func.count(models.Property.id).label("count")
    ).group_by(
        models.Property.property_type, 
        models.Property.is_available
    ).all()
    
    return {
        "total_properties": total,
        "available_now": available,
        "currently_rented": total - available,
        "availability_rate": round(available / total * 100, 2) if total > 0 else 0,
        "by_type": [
            {
                "type": t or "Unknown",
                "available": a,
                "count": c
            } for t, a, c in availability_by_type
        ],
    }


async def get_lead_insights_data(db: Session, start_date: datetime, end_date: datetime):
    """Get lead insights data for report"""
    
    # Total leads
    total_leads = db.query(func.count(models.Lead.id)).scalar() or 0
    
    # Leads in period
    period_leads = db.query(func.count(models.Lead.id)).filter(
        models.Lead.created_at >= start_date,
        models.Lead.created_at <= end_date
    ).scalar() or 0
    
    # Lead status distribution
    status_dist = db.query(
        models.Lead.status,
        func.count(models.Lead.id).label("count")
    ).group_by(models.Lead.status).all()
    
    # Lead source distribution
    source_dist = db.query(
        models.Lead.source,
        func.count(models.Lead.id).label("count")
    ).group_by(models.Lead.source).all()
    
    # Conversion rate
    converted = db.query(func.count(models.Lead.id)).filter(
        models.Lead.status == "converted"
    ).scalar() or 0
    
    return {
        "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        "total_leads": total_leads,
        "leads_in_period": period_leads,
        "converted_leads": converted,
        "conversion_rate": round(converted / total_leads * 100, 2) if total_leads > 0 else 0,
        "by_status": [{"status": s or "Unknown", "count": c} for s, c in status_dist],
        "by_source": [{"source": src or "Unknown", "count": c} for src, c in source_dist],
    }


async def get_listing_performance_data(db: Session, start_date: datetime, end_date: datetime):
    """Get listing performance data for report"""
    
    # Properties with most leads
    popular_properties = db.query(
        models.Property.title,
        models.Property.location,
        func.count(models.Lead.id).label("lead_count")
    ).outerjoin(models.Lead).group_by(
        models.Property.id,
        models.Property.title,
        models.Property.location
    ).order_by(func.count(models.Lead.id).desc()).limit(10).all()
    
    return {
        "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        "top_listings": [
            {
                "title": p.title,
                "location": p.location,
                "leads": p.lead_count
            } for p in popular_properties
        ],
    }


async def get_market_analysis_data(db: Session):
    """Get market analysis data for report"""
    
    # Price analysis by type (simplified - prices are strings)
    properties = db.query(models.Property).all()
    
    type_counts = {}
    for p in properties:
        t = p.property_type or "Unknown"
        if t not in type_counts:
            type_counts[t] = 0
        type_counts[t] += 1
    
    return {
        "total_properties": len(properties),
        "property_type_distribution": [
            {"type": k, "count": v} for k, v in type_counts.items()
        ],
        "market_summary": "Market analysis based on current property listings.",
    }


async def get_business_context(db: Session):
    """Get general business context for answering questions"""
    
    property_stats = property_service.get_property_stats(db)
    lead_stats = lead_service.get_lead_stats(db)
    
    return {
        "properties": property_stats,
        "leads": lead_stats,
        "context_date": datetime.now().isoformat()
    }
