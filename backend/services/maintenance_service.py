from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import timedelta
from models.models import User, Membership
from core.security import hash_password
from schemas.membership import AddMembershipRequest, UpdateMembershipRequest
from schemas.user import AddUserRequest, UpdateUserRequest

DURATION_DAYS = {"6 months": 180, "1 year": 365, "2 years": 730}


def add_membership(data: AddMembershipRequest, db: Session):
    end_date = data.start_date + timedelta(days=DURATION_DAYS[data.duration])
    count = db.query(Membership).count()
    membership_number = f"MEM{str(count + 1).zfill(6)}"

    m = Membership(
        membership_number=membership_number,
        first_name=data.first_name,
        last_name=data.last_name,
        contact_number=data.contact_number,
        contact_address=data.contact_address,
        aadhar_card_no=data.aadhar_card_no,
        start_date=data.start_date,
        end_date=end_date,
        duration=data.duration,
        is_active=True,
        fine_pending=0.0,
    )
    db.add(m)
    db.commit()
    return {"message": "Membership added successfully", "membership_number": membership_number}


def update_membership(data: UpdateMembershipRequest, db: Session):
    m = db.query(Membership).filter(Membership.membership_number == data.membership_number).first()
    if not m:
        raise HTTPException(status_code=404, detail="Membership not found")

    if data.cancel:
        m.is_active = False
    elif data.extension:
        m.end_date = m.end_date + timedelta(days=DURATION_DAYS[data.extension])
        m.is_active = True

    db.commit()
    return {"message": "Membership updated", "end_date": m.end_date, "is_active": m.is_active}


def add_user(data: AddUserRequest, db: Session):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(
        name=data.name,
        username=data.username,
        password_hash=hash_password(data.password),
        is_active=data.is_active,
        is_admin=data.is_admin,
    )
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}


def update_user(data: UpdateUserRequest, db: Session):
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name is not None:
        user.name = data.name
    if data.is_active is not None:
        user.is_active = data.is_active
    if data.is_admin is not None:
        user.is_admin = data.is_admin

    db.commit()
    return {"message": "User updated successfully"}


def list_users(db: Session):
    return db.query(User).all()


def list_memberships(db: Session):
    return db.query(Membership).all()