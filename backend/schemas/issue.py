from pydantic import BaseModel, field_validator, model_validator
from datetime import date, timedelta
from typing import Optional


class IssueBookRequest(BaseModel):
    item_id: int
    membership_number: str
    issue_date: date
    return_date: date
    remarks: Optional[str] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.issue_date < date.today():
            raise ValueError("Issue date cannot be in the past")
        max_return = self.issue_date + timedelta(days=15)
        if self.return_date > max_return:
            raise ValueError("Return date cannot exceed 15 days from issue date")
        return self


class ReturnBookRequest(BaseModel):
    serial_no: str
    actual_return_date: date
    remarks: Optional[str] = None


class ReturnBookPreview(BaseModel):
    issue_id: int
    item_name: str
    author_name: str
    serial_no: str
    issue_date: date
    expected_return_date: date
    actual_return_date: date
    fine_calculated: float
    membership_number: str


class PayFineRequest(BaseModel):
    issue_id: int
    fine_paid: bool
    remarks: Optional[str] = None


class IssueRequestCreate(BaseModel):
    membership_number: str
    item_name: str