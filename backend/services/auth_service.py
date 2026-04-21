from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.models import User
from core.security import verify_password, create_access_token
from schemas.auth import LoginResponse


def login_user(username: str, password: str, db: Session) -> LoginResponse:
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token = create_access_token({"sub": user.username})
    return LoginResponse(access_token=token, is_admin=user.is_admin, name=user.name)