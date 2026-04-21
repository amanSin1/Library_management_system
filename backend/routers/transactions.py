from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from core.dependencies import get_current_user
from models.models import User
from schemas.issue import IssueBookRequest, ReturnBookRequest, PayFineRequest, IssueRequestCreate
from services.transaction_service import issue_book, preview_return, pay_fine_and_complete, create_issue_request

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/issue")
def issue(data: IssueBookRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return issue_book(data, db)


@router.post("/return")
def return_book(data: ReturnBookRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return preview_return(data, db)


@router.post("/pay-fine")
def pay_fine(data: PayFineRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return pay_fine_and_complete(data, db)


@router.post("/request")
def request_issue(data: IssueRequestCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return create_issue_request(data, db)