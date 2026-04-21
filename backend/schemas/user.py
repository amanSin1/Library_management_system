from pydantic import BaseModel
from typing import Optional


class AddUserRequest(BaseModel):
    name: str
    username: str
    password: str
    is_active: bool = True
    is_admin: bool = False


class UpdateUserRequest(BaseModel):
    username: str
    name: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class UserOut(BaseModel):
    id: int
    name: str
    username: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True