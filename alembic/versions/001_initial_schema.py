"""Initial schema: User, Property, Amenity, Booking, Review tables

Revision ID: 001_initial_schema
Revises: 
Create Date: 2025-12-05 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create ENUM types
    user_roles_enum = postgresql.ENUM("tenant", "admin", name="user_roles")
    user_roles_enum.create(op.get_bind(), checkfirst=True)

    booking_status_enum = postgresql.ENUM("pending", "confirmed", "active", "completed", name="booking_status")
    booking_status_enum.create(op.get_bind(), checkfirst=True)

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', user_roles_enum, nullable=False, server_default='tenant'),
        sa.Column('phone_number', sa.String(50), nullable=True),
        sa.Column('is_kyc_verified', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.Index('ix_users_email', 'email')
    )

    # Create properties table
    op.create_table(
        'properties',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('location_area', sa.String(255), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('deposit', sa.Float(), nullable=True),
        sa.Column('gender_type', sa.String(50), nullable=True),
        sa.Column('is_occupancy_full', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('video_url', sa.String(1024), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )

    # Create amenities table
    op.create_table(
        'amenities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False, unique=True),
        sa.Column('icon_name', sa.String(255), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create property_amenity association table (many-to-many)
    op.create_table(
        'property_amenity',
        sa.Column('property_id', sa.Integer(), nullable=False),
        sa.Column('amenity_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['amenity_id'], ['amenities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('property_id', 'amenity_id')
    )

    # Create bookings table
    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('property_id', sa.Integer(), nullable=False),
        sa.Column('status', booking_status_enum, nullable=False, server_default='pending'),
        sa.Column('check_in_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create reviews table
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('property_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('reviews')
    op.drop_table('bookings')
    op.drop_table('property_amenity')
    op.drop_table('amenities')
    op.drop_table('properties')
    op.drop_table('users')

    # Drop ENUM types
    sa.Enum(name='booking_status').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='user_roles').drop(op.get_bind(), checkfirst=True)
