from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    membership_number = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    contact_address = Column(String, nullable=False)
    aadhar_card_no = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    duration = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    fine_pending = Column(Float, default=0.0)

    issues = relationship("Issue", back_populates="membership")
    issue_requests = relationship("IssueRequest", back_populates="membership")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    serial_no = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    author_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    item_type = Column(String, nullable=False)   # "Book" | "Movie"
    status = Column(String, default="Available") # "Available" | "Issued" | "Lost"
    cost = Column(Float, nullable=False)
    procurement_date = Column(Date, nullable=False)

    issues = relationship("Issue", back_populates="item")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    membership_id = Column(Integer, ForeignKey("memberships.id"), nullable=False)
    issue_date = Column(Date, nullable=False)
    expected_return_date = Column(Date, nullable=False)
    actual_return_date = Column(Date, nullable=True)
    remarks = Column(String, nullable=True)
    fine_calculated = Column(Float, default=0.0)
    fine_paid = Column(Boolean, default=False)
    is_returned = Column(Boolean, default=False)

    item = relationship("Item", back_populates="issues")
    membership = relationship("Membership", back_populates="issues")


class IssueRequest(Base):
    __tablename__ = "issue_requests"

    id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(Integer, ForeignKey("memberships.id"), nullable=False)
    item_name = Column(String, nullable=False)
    requested_date = Column(Date, nullable=False)
    fulfilled_date = Column(Date, nullable=True)
    is_fulfilled = Column(Boolean, default=False)

    membership = relationship("Membership", back_populates="issue_requests")