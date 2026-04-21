from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from core.dependencies import require_admin
from models.models import User
from schemas.membership import AddMembershipRequest, UpdateMembershipRequest
from schemas.book import AddItemRequest, UpdateItemRequest
from schemas.user import AddUserRequest, UpdateUserRequest
from services.maintenance_service import (
    add_membership, update_membership,
    add_user, update_user,
    list_users, list_memberships,
)
from services.book_service import add_item, update_item

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


@router.post("/membership/add")
def add_mem(data: AddMembershipRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return add_membership(data, db)


@router.put("/membership/update")
def update_mem(data: UpdateMembershipRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return update_membership(data, db)


@router.post("/item/add")
def add_item_route(data: AddItemRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return add_item(data, db)


@router.put("/item/update")
def update_item_route(data: UpdateItemRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return update_item(data, db)


@router.post("/user/add")
def add_user_route(data: AddUserRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return add_user(data, db)


@router.put("/user/update")
def update_user_route(data: UpdateUserRequest, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return update_user(data, db)


@router.get("/users")
def get_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return list_users(db)


@router.get("/memberships")
def get_memberships(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return list_memberships(db)