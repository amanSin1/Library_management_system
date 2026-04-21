from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date, timedelta
from models.models import Item, Membership, Issue, IssueRequest
from schemas.issue import IssueBookRequest, ReturnBookRequest, PayFineRequest, IssueRequestCreate

FINE_PER_DAY = 1.0  # ₹1 per day overdue


def issue_book(data: IssueBookRequest, db: Session):
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.status != "Available":
        raise HTTPException(status_code=400, detail="Item is not available for issue")

    membership = db.query(Membership).filter(
        Membership.membership_number == data.membership_number,
        Membership.is_active == True,
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Active membership not found")

    issue = Issue(
        item_id=item.id,
        membership_id=membership.id,
        issue_date=data.issue_date,
        expected_return_date=data.return_date,
        remarks=data.remarks,
    )
    item.status = "Issued"
    db.add(issue)
    db.commit()
    return {"message": "Book issued successfully", "issue_id": issue.id}


def preview_return(data: ReturnBookRequest, db: Session):
    item = db.query(Item).filter(Item.serial_no == data.serial_no).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    issue = db.query(Issue).filter(
        Issue.item_id == item.id,
        Issue.is_returned == False,
    ).first()
    if not issue:
        raise HTTPException(status_code=404, detail="No active issue found for this serial number")

    days_overdue = (data.actual_return_date - issue.expected_return_date).days
    fine = max(0.0, days_overdue * FINE_PER_DAY)

    issue.fine_calculated = fine
    issue.actual_return_date = data.actual_return_date
    if data.remarks:
        issue.remarks = data.remarks
    db.commit()

    return {
        "issue_id": issue.id,
        "item_name": item.name,
        "author_name": item.author_name,
        "serial_no": item.serial_no,
        "issue_date": issue.issue_date,
        "expected_return_date": issue.expected_return_date,
        "actual_return_date": data.actual_return_date,
        "fine_calculated": fine,
        "membership_number": issue.membership.membership_number,
    }


def pay_fine_and_complete(data: PayFineRequest, db: Session):
    issue = db.query(Issue).filter(Issue.id == data.issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue record not found")
    if issue.is_returned:
        raise HTTPException(status_code=400, detail="Book is already returned")
    if issue.fine_calculated > 0 and not data.fine_paid:
        raise HTTPException(status_code=400, detail="Fine must be paid before completing the return")

    issue.fine_paid = data.fine_paid
    issue.is_returned = True
    if data.remarks:
        issue.remarks = data.remarks
    issue.item.status = "Available"
    db.commit()
    return {"message": "Return completed successfully"}


def create_issue_request(data: IssueRequestCreate, db: Session):
    membership = db.query(Membership).filter(
        Membership.membership_number == data.membership_number,
        Membership.is_active == True,
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Active membership not found")

    req = IssueRequest(
        membership_id=membership.id,
        item_name=data.item_name,
        requested_date=date.today(),
    )
    db.add(req)
    db.commit()
    return {"message": "Issue request submitted"}