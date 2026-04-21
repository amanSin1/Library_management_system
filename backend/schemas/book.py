from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional


class BookSearchResult(BaseModel):
    id: int
    serial_no: str
    name: str
    author_name: str
    category: str
    item_type: str
    status: str
    available: bool

    class Config:
        from_attributes = True


class AddItemRequest(BaseModel):
    name: str
    author_name: str
    category: str
    item_type: str  # "Book" | "Movie"
    cost: float
    procurement_date: date
    quantity: int = 1

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        allowed = {"Science", "Economics", "Fiction", "Children", "Personal Development"}
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v

    @field_validator("item_type")
    @classmethod
    def validate_item_type(cls, v):
        if v not in {"Book", "Movie"}:
            raise ValueError("item_type must be 'Book' or 'Movie'")
        return v

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class UpdateItemRequest(BaseModel):
    serial_no: str
    status: Optional[str] = None
    name: Optional[str] = None
    item_type: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v and v not in {"Available", "Issued", "Lost"}:
            raise ValueError("Status must be Available, Issued, or Lost")
        return v


class AddItemResponse(BaseModel):
    message: str
    serial_numbers: list[str]