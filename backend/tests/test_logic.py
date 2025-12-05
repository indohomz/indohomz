import sys
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

# Ensure project root is importable during tests
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from backend import models


@pytest.fixture()
def session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    models.Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    sess = Session()
    try:
        yield sess
    finally:
        sess.close()
        engine.dispose()


def test_review_constraint_no_booking(session):
    # Create a user and a property, but no booking
    user = models.User(email="hacker@example.com", password_hash="x")
    prop = models.Property(title="Nice Room", price=100.0)
    session.add_all([user, prop])
    session.commit()

    review = models.Review(property_id=prop.id, user_id=user.id, rating=5, comment="Great")
    session.add(review)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()


def test_review_constraint_pending_booking(session):
    user = models.User(email="pending@example.com", password_hash="x")
    prop = models.Property(title="Room B", price=120.0)
    session.add_all([user, prop])
    session.commit()

    # pending booking should not allow review
    booking = models.Booking(user_id=user.id, property_id=prop.id, status="pending")
    session.add(booking)
    session.commit()

    review = models.Review(property_id=prop.id, user_id=user.id, rating=4, comment="ok")
    session.add(review)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()


def test_review_constraint_completed_booking_allows_review(session):
    user = models.User(email="tenant@example.com", password_hash="x")
    prop = models.Property(title="Room C", price=150.0)
    session.add_all([user, prop])
    session.commit()

    booking = models.Booking(user_id=user.id, property_id=prop.id, status="completed")
    session.add(booking)
    session.commit()

    review = models.Review(property_id=prop.id, user_id=user.id, rating=5, comment="Loved it")
    session.add(review)
    # Should not raise
    session.commit()

    # verify persisted
    found = session.query(models.Review).filter_by(user_id=user.id, property_id=prop.id).one()
    assert found.rating == 5


def test_booking_prevented_when_property_full(session):
    user = models.User(email="full@example.com", password_hash="x")
    prop = models.Property(title="Full House", price=200.0, is_occupancy_full=True)
    session.add_all([user, prop])
    session.commit()

    booking = models.Booking(user_id=user.id, property_id=prop.id, status="pending")
    session.add(booking)
    with pytest.raises(IntegrityError):
        session.commit()
    session.rollback()
