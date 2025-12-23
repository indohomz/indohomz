from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


# =============================================================================
# PROPERTY SCHEMAS (IndoHomz Core)
# =============================================================================

class PropertyType(str, Enum):
    APARTMENT = "apartment"
    VILLA = "villa"
    STUDIO = "studio"
    PENTHOUSE = "penthouse"
    PG = "pg"
    INDEPENDENT_HOUSE = "independent_house"
    FARMHOUSE = "farmhouse"


class FurnishingType(str, Enum):
    FURNISHED = "furnished"
    SEMI_FURNISHED = "semi-furnished"
    UNFURNISHED = "unfurnished"


class PropertyBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    price: str = Field(..., min_length=1, max_length=100)  # e.g., "₹15,000/month"
    
    # Location
    location: str = Field(default="Gurgaon", max_length=255)
    area: Optional[str] = Field(None, max_length=100)
    city: str = Field(default="Gurgaon", max_length=100)
    
    # Property Details
    property_type: Optional[str] = Field(default="apartment", max_length=50)
    bedrooms: Optional[int] = Field(None, ge=0, le=10)
    bathrooms: Optional[int] = Field(None, ge=0, le=10)
    area_sqft: Optional[int] = Field(None, ge=0)
    furnishing: Optional[str] = Field(default="furnished", max_length=50)
    
    # Media
    image_url: Optional[str] = Field(None, max_length=1024)
    images: Optional[str] = None  # JSON array of image URLs
    
    # Features
    amenities: str = Field(default="Wifi, AC, Power Backup", max_length=1000)
    highlights: Optional[str] = None
    
    # AI Content
    description: Optional[str] = None
    
    # Availability
    is_available: bool = True
    available_from: Optional[datetime] = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    area: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    property_type: Optional[str] = Field(None, max_length=50)
    bedrooms: Optional[int] = Field(None, ge=0, le=10)
    bathrooms: Optional[int] = Field(None, ge=0, le=10)
    area_sqft: Optional[int] = Field(None, ge=0)
    furnishing: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=1024)
    images: Optional[str] = None
    amenities: Optional[str] = Field(None, max_length=1000)
    highlights: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None
    available_from: Optional[datetime] = None


class Property(PropertyBase):
    id: int
    slug: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PropertyListResponse(BaseModel):
    """Paginated property list response"""
    items: List[Property]
    total: int
    skip: int
    limit: int
    has_more: bool


# =============================================================================
# LEAD SCHEMAS (Customer Inquiries)
# =============================================================================

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    SITE_VISIT = "site_visit"
    NEGOTIATION = "negotiation"
    CONVERTED = "converted"
    LOST = "lost"


class LeadSource(str, Enum):
    WEBSITE = "website"
    WHATSAPP = "whatsapp"
    REFERRAL = "referral"
    INSTAGRAM = "instagram"
    GOOGLE = "google"
    WALK_IN = "walk_in"


class LeadBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=10, max_length=20)
    property_id: Optional[int] = None
    message: Optional[str] = None
    preferred_visit_date: Optional[datetime] = None
    source: str = Field(default="website", max_length=50)


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    property_id: Optional[int] = None
    message: Optional[str] = None
    preferred_visit_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)
    source: Optional[str] = Field(None, max_length=50)


class Lead(LeadBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =============================================================================
# BOOKING SCHEMAS
# =============================================================================

class BookingStatus(str, Enum):
    CONFIRMED = "confirmed"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class BookingBase(BaseModel):
    property_id: int
    lead_id: Optional[int] = None
    tenant_name: str = Field(..., min_length=1, max_length=100)
    tenant_email: Optional[EmailStr] = None
    tenant_phone: str = Field(..., min_length=10, max_length=20)
    check_in: datetime
    check_out: Optional[datetime] = None
    monthly_rent: float = Field(..., gt=0)
    security_deposit: Optional[float] = Field(None, ge=0)


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    tenant_name: Optional[str] = Field(None, min_length=1, max_length=100)
    tenant_email: Optional[EmailStr] = None
    tenant_phone: Optional[str] = Field(None, min_length=10, max_length=20)
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    monthly_rent: Optional[float] = Field(None, gt=0)
    security_deposit: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=50)


class Booking(BookingBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =============================================================================
# ANALYTICS SCHEMAS (IndoHomz Dashboard)
# =============================================================================

class PropertyAnalytics(BaseModel):
    """Dashboard analytics for property performance"""
    total_properties: int
    available_properties: int
    rented_properties: int
    total_leads: int
    conversion_rate: float  # leads to bookings
    popular_locations: List[dict]
    property_type_distribution: List[dict]
    price_range_distribution: List[dict]


class LeadAnalytics(BaseModel):
    """Lead funnel analytics"""
    total_leads: int
    new_leads: int
    contacted_leads: int
    site_visits_scheduled: int
    converted_leads: int
    lead_sources: List[dict]
    conversion_funnel: List[dict]


# =============================================================================
# SEARCH SCHEMAS (For AI Semantic Search - Future)
# =============================================================================

class PropertySearchRequest(BaseModel):
    """Search request with optional filters"""
    query: Optional[str] = None  # Natural language search query
    location: Optional[str] = None
    city: Optional[str] = None
    property_type: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    bedrooms: Optional[int] = None
    amenities: Optional[List[str]] = None
    is_available: Optional[bool] = True
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=12, ge=1, le=50)


class PropertySearchResponse(BaseModel):
    """Search results with metadata"""
    items: List[Property]
    total: int
    page: int
    page_size: int
    query: Optional[str] = None
    filters_applied: dict


# =============================================================================
# AI REPORT SCHEMAS (IndoHomz Insights)
# =============================================================================

class ReportType(str, Enum):
    PROPERTY_OVERVIEW = "property_overview"
    AVAILABILITY_STATUS = "availability_status"
    LEAD_INSIGHTS = "lead_insights"
    LISTING_PERFORMANCE = "listing_performance"
    MARKET_ANALYSIS = "market_analysis"


class ReportRequest(BaseModel):
    report_type: ReportType
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    filters: Optional[dict] = None


class ReportResponse(BaseModel):
    report_type: str
    summary: str
    detailed_analysis: str
    recommendations: List[str]
    generated_at: datetime


# =============================================================================
# WHATSAPP INTEGRATION SCHEMAS (Future)
# =============================================================================

class WhatsAppInquiry(BaseModel):
    """Incoming WhatsApp message/inquiry"""
    phone: str
    message: str
    property_id: Optional[int] = None
    timestamp: datetime


class WhatsAppResponse(BaseModel):
    """Response to send via WhatsApp"""
    phone: str
    message: str
    property_details: Optional[Property] = None
