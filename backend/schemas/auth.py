from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_admin: bool
    name: str


class MeResponse(BaseModel):
    id: int
    name: str
    username: str
    is_admin: bool