from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    phone_number: Optional[str] = None
    is_kyc_verified: bool = False

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Amenity Schemas
class AmenityBase(BaseModel):
    name: str
    icon_name: Optional[str] = None

class AmenityOut(AmenityBase):
    id: int

    class Config:
        from_attributes = True

# Property Schemas
class PropertyBase(BaseModel):
    title: str
    location_area: Optional[str] = None
    price: float
    deposit: Optional[float] = None
    gender_type: Optional[str] = None
    is_occupancy_full: bool = False
    video_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    amenity_ids: Optional[List[int]] = None

class PropertyOut(PropertyBase):
    id: int
    created_at: datetime
    amenities: Optional[List[AmenityOut]] = None

    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    property_id: int
    check_in_date: Optional[datetime] = None

class BookingCreate(BookingBase):
    pass

class BookingOut(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Review Schemas
class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    property_id: int

class ReviewOut(ReviewBase):
    id: int
    user_id: int
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True
