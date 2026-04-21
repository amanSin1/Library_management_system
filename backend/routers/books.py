from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from core.dependencies import get_current_user
from models.models import User
from services.book_service import search_items, get_all_item_names, get_items_by_name

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/search")
def search(
    name: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return search_items(name, author, db)


@router.get("/names")
def all_names(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_all_item_names(db)


@router.get("/by-name/{name}")
def by_name(name: str, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_items_by_name(name, db)