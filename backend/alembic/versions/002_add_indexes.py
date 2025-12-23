"""Add database indexes for performance

Revision ID: 002
Revises: 001
Create Date: 2025-12-23

"""
from alembic import op


# revision identifiers
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    """Add performance indexes"""
    
    # Properties table indexes
    op.create_index('idx_properties_city', 'properties', ['city'])
    op.create_index('idx_properties_is_available', 'properties', ['is_available'])
    op.create_index('idx_properties_property_type', 'properties', ['property_type'])
    op.create_index('idx_properties_created_at', 'properties', ['created_at'])
    op.create_index('idx_properties_slug', 'properties', ['slug'], unique=True)
    
    # Composite index for common query (available properties in a city)
    op.create_index(
        'idx_properties_city_available',
        'properties',
        ['city', 'is_available']
    )
    
    # Leads table indexes
    op.create_index('idx_leads_status', 'leads', ['status'])
    op.create_index('idx_leads_property_id', 'leads', ['property_id'])
    op.create_index('idx_leads_created_at', 'leads', ['created_at'])
    op.create_index('idx_leads_phone', 'leads', ['phone'])
    
    # Composite index for property leads
    op.create_index(
        'idx_leads_property_status',
        'leads',
        ['property_id', 'status']
    )
    
    # Bookings table indexes
    op.create_index('idx_bookings_property_id', 'bookings', ['property_id'])
    op.create_index('idx_bookings_status', 'bookings', ['status'])
    op.create_index('idx_bookings_created_at', 'bookings', ['created_at'])


def downgrade():
    """Remove indexes"""
    
    # Properties indexes
    op.drop_index('idx_properties_city')
    op.drop_index('idx_properties_is_available')
    op.drop_index('idx_properties_property_type')
    op.drop_index('idx_properties_created_at')
    op.drop_index('idx_properties_slug')
    op.drop_index('idx_properties_city_available')
    
    # Leads indexes
    op.drop_index('idx_leads_status')
    op.drop_index('idx_leads_property_id')
    op.drop_index('idx_leads_created_at')
    op.drop_index('idx_leads_phone')
    op.drop_index('idx_leads_property_status')
    
    # Bookings indexes
    op.drop_index('idx_bookings_property_id')
    op.drop_index('idx_bookings_status')
    op.drop_index('idx_bookings_created_at')
