from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from core.dependencies import get_current_user
from models.models import User
from services.report_service import (
    get_books_report, get_movies_report, get_memberships_report,
    get_active_issues, get_overdue_returns, get_issue_requests,
)

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/books")
def books(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_books_report(db)


@router.get("/movies")
def movies(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_movies_report(db)


@router.get("/memberships")
def memberships(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_memberships_report(db)


@router.get("/active-issues")
def active_issues(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_active_issues(db)


@router.get("/overdue")
def overdue(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_overdue_returns(db)


@router.get("/issue-requests")
def issue_requests(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return get_issue_requests(db)