from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    event,
    select,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Association table for many-to-many Property <-> Amenity
property_amenity = Table(
    "property_amenity",
    Base.metadata,
    Column("property_id", Integer, ForeignKey("properties.id"), primary_key=True),
    Column("amenity_id", Integer, ForeignKey("amenities.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("tenant", "admin", name="user_roles"), nullable=False, default="tenant")
    phone_number = Column(String(50), nullable=True)
    is_kyc_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    location_area = Column(String(255), nullable=True)
    price = Column(Float, nullable=False)
    deposit = Column(Float, nullable=True)
    gender_type = Column(String(50), nullable=True)  # e.g., 'male', 'female', 'any'
    is_occupancy_full = Column(Boolean, default=False, nullable=False)
    video_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    amenities = relationship("Amenity", secondary=property_amenity, back_populates="properties")
    bookings = relationship("Booking", back_populates="property", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="property", cascade="all, delete-orphan")


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    icon_name = Column(String(255), nullable=True)

    properties = relationship("Property", secondary=property_amenity, back_populates="amenities")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    status = Column(
        Enum("pending", "confirmed", "active", "completed", name="booking_status"),
        nullable=False,
        default="pending",
    )
    check_in_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    property = relationship("Property", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    property = relationship("Property", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


# ORM-level enforcement: ensure a user creating a Review has an 'active' or 'completed'
# booking for the same property. This is implemented as a before_insert event on the
# Review mapper — it runs on new Review instances and raises an IntegrityError if
# the constraint is not met.
@event.listens_for(Review, "before_insert")
def _check_user_has_booking(mapper, connection, target: Review) -> None:
    # Using a SQL expression to check for existence of a matching booking
    booking_table = Booking.__table__
    stmt = select(booking_table.c.id).where(
        (booking_table.c.user_id == target.user_id)
        & (booking_table.c.property_id == target.property_id)
        & (booking_table.c.status.in_(["active", "completed"]))
    ).limit(1)

    result = connection.execute(stmt).first()
    if result is None:
        raise IntegrityError(
            "Review constraint",
            params={"user_id": target.user_id, "property_id": target.property_id},
            orig=Exception("User must have an active or completed booking for this property before reviewing."),
        )


# Prevent bookings when the property is already full
@event.listens_for(Booking, "before_insert")
def _prevent_booking_if_full(mapper, connection, target: Booking) -> None:
    prop_table = Property.__table__
    stmt = select(prop_table.c.is_occupancy_full).where(prop_table.c.id == target.property_id).limit(1)
    result = connection.execute(stmt).first()
    if result is not None and result[0]:
        raise IntegrityError(
            "Booking constraint",
            params={"property_id": target.property_id},
            orig=Exception("Cannot create booking: property is full."),
        )
