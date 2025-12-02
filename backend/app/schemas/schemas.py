from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Property Schemas (converted from Product)
class PropertyBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    price: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(default="Gurgaon", max_length=100)
    image_url: Optional[str] = Field(None, max_length=1024)
    amenities: Optional[str] = Field(default="Wifi, AC, Power Backup", max_length=500)
    is_available: bool = True

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=1024)
    amenities: Optional[str] = Field(None, max_length=500)
    is_available: Optional[bool] = None

class Property(PropertyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=50)
    zip_code: Optional[str] = Field(None, max_length=20)
    country: str = Field(default="USA", max_length=50)
    date_of_birth: Optional[datetime] = None
    customer_segment: Optional[str] = Field(None, max_length=50)
    is_active: bool = True

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=50)
    zip_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=50)
    date_of_birth: Optional[datetime] = None
    customer_segment: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

class Customer(CustomerBase):
    id: int
    total_spent: float
    total_orders: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

"""
Sale Schemas are commented out because the database Sale model referenced Products
which have been converted to Properties. Re-enable and adapt these schemas if you
intend to keep sales functionality tied to properties or restore a sales table.

class SaleBase(BaseModel):
    product_id: int
    customer_id: int
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    discount_amount: float = Field(default=0.0, ge=0)
    tax_amount: float = Field(default=0.0, ge=0)
    payment_method: Optional[str] = Field(None, max_length=50)
    store_location: Optional[str] = Field(None, max_length=100)
    sales_channel: str = Field(default="in-store", max_length=50)

class SaleCreate(SaleBase):
    transaction_id: str = Field(..., min_length=1, max_length=100)

class Sale(SaleBase):
    id: int
    total_amount: float
    final_amount: float
    sale_date: datetime
    transaction_id: str
    created_at: datetime
    # product: Product
    # customer: Customer
    
    class Config:
        from_attributes = True
"""

# Analytics Schemas
class SalesAnalytics(BaseModel):
    total_sales: float
    total_orders: int
    average_order_value: float
    top_products: List[dict]
    top_customers: List[dict]
    sales_by_category: List[dict]
    sales_trend: List[dict]

class PredictionRequest(BaseModel):
    product_id: int
    days_ahead: int = Field(default=7, ge=1, le=365)

class PredictionResponse(BaseModel):
    product_id: int
    product_name: str
    predicted_quantity: float
    confidence_score: float
    prediction_date: datetime
    model_version: str

# Report Schemas
class ReportType(str, Enum):
    SALES_SUMMARY = "sales_summary"
    INVENTORY_STATUS = "inventory_status"
    CUSTOMER_INSIGHTS = "customer_insights"
    PRODUCT_PERFORMANCE = "product_performance"

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
