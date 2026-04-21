from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import LoginRequest, LoginResponse, MeResponse
from services.auth_service import login_user
from core.dependencies import get_current_user
from models.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data.username, data.password, db)


@router.get("/me", response_model=MeResponse)
def me(user: User = Depends(get_current_user)):
    return user