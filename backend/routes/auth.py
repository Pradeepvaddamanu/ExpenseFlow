from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.login import UserLogin
from utils.jwt_handler import create_access_token
from utils.security import verify_password
from utils.email_sender import send_welcome_email

from database import get_db
from models import User

from schemas.user import UserCreate
from utils.security import hash_password

router = APIRouter()


@router.get("/test")
def test():
    return {"message": "Auth Route Working"}


@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user_data.password)

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()

    try:
        send_welcome_email(
            user.email,
            user.name
        )
    except Exception as e:
        print("Email error:", e)

    return {"message": "User Registered Successfully"}
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    access_token = create_access_token(
    data={
        "sub": user.email,
        "user_id": user.id
    }
)

    return {
    "access_token": access_token,
    "token_type": "bearer",
    "name": user.name
    }