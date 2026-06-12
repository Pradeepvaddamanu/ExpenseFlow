from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.auth import get_current_user
from database import get_db
from models import Activity

router = APIRouter()

@router.get("/activities")
def get_activities(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activities = (
        db.query(Activity)
        .filter(
            Activity.user_id == current_user["user_id"]
        )
        .order_by(Activity.created_at.desc())
        .limit(10)
        .all()
    )

    return activities