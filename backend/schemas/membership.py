from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional


class AddMembershipRequest(BaseModel):
    first_name: str
    last_name: str
    contact_number: str
    contact_address: str
    aadhar_card_no: str
    start_date: date
    duration: str  # "6 months" | "1 year" | "2 years"

    @field_validator("duration")
    @classmethod
    def validate_duration(cls, v):
        if v not in {"6 months", "1 year", "2 years"}:
            raise ValueError("Duration must be '6 months', '1 year', or '2 years'")
        return v

    @field_validator("contact_number")
    @classmethod
    def validate_phone(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Contact number must be 10 digits")
        return v


class AddMembershipResponse(BaseModel):
    message: str
    membership_number: str


class UpdateMembershipRequest(BaseModel):
    membership_number: str
    extension: Optional[str] = None  # "6 months" | "1 year" | "2 years"
    cancel: Optional[bool] = False

    @field_validator("extension")
    @classmethod
    def validate_extension(cls, v):
        if v and v not in {"6 months", "1 year", "2 years"}:
            raise ValueError("Extension must be '6 months', '1 year', or '2 years'")
        return v


class MembershipOut(BaseModel):
    membership_number: str
    name: str
    contact_number: str
    contact_address: str
    aadhar_card_no: str
    start_date: date
    end_date: date
    status: str
    fine_pending: float