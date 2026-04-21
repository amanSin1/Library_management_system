from sqlalchemy.orm import Session
from datetime import date
from models.models import Item, Membership, Issue, IssueRequest

FINE_PER_DAY = 1.0


def get_books_report(db: Session):
    items = db.query(Item).filter(Item.item_type == "Book").all()
    return [_item_to_dict(i) for i in items]


def get_movies_report(db: Session):
    items = db.query(Item).filter(Item.item_type == "Movie").all()
    return [_item_to_dict(i) for i in items]


def get_memberships_report(db: Session):
    members = db.query(Membership).all()
    return [
        {
            "membership_number": m.membership_number,
            "name": f"{m.first_name} {m.last_name}",
            "contact_number": m.contact_number,
            "contact_address": m.contact_address,
            "aadhar_card_no": m.aadhar_card_no,
            "start_date": m.start_date,
            "end_date": m.end_date,
            "status": "Active" if m.is_active else "Inactive",
            "fine_pending": m.fine_pending,
        }
        for m in members
    ]


def get_active_issues(db: Session):
    issues = db.query(Issue).filter(Issue.is_returned == False).all()
    return [
        {
            "serial_no": i.item.serial_no,
            "name": i.item.name,
            "membership_number": i.membership.membership_number,
            "issue_date": i.issue_date,
            "expected_return_date": i.expected_return_date,
        }
        for i in issues
    ]


def get_overdue_returns(db: Session):
    today = date.today()
    issues = db.query(Issue).filter(
        Issue.is_returned == False,
        Issue.expected_return_date < today,
    ).all()
    return [
        {
            "serial_no": i.item.serial_no,
            "name": i.item.name,
            "membership_number": i.membership.membership_number,
            "issue_date": i.issue_date,
            "expected_return_date": i.expected_return_date,
            "fine_calculated": (today - i.expected_return_date).days * FINE_PER_DAY,
        }
        for i in issues
    ]


def get_issue_requests(db: Session):
    reqs = db.query(IssueRequest).all()
    return [
        {
            "id": r.id,
            "membership_number": r.membership.membership_number,
            "item_name": r.item_name,
            "requested_date": r.requested_date,
            "fulfilled_date": r.fulfilled_date,
            "is_fulfilled": r.is_fulfilled,
        }
        for r in reqs
    ]


def _item_to_dict(i: Item):
    return {
        "serial_no": i.serial_no,
        "name": i.name,
        "author_name": i.author_name,
        "category": i.category,
        "status": i.status,
        "cost": i.cost,
        "procurement_date": i.procurement_date,
    }