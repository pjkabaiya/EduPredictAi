from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.prediction_service import PredictionService
from utils.database import get_db
from utils.firebase_auth import verify_token
from datetime import datetime, timezone

router = APIRouter()
prediction_service = PredictionService()


class PredictionRequest(BaseModel):
    age: int
    gender: str
    kcpe_marks: float
    kcse_grade: str
    university_previous_grade: str
    study_hours_per_week: float
    attendance_percentage: float
    assignment_completion_rate: float
    internet_access: str
    parent_education: str
    sleep_hours: float
    extracurricular_activities: str


@router.post("/predict")
async def predict(request: PredictionRequest, user: dict = Depends(verify_token)):
    result = prediction_service.predict(request.model_dump())

    try:
        db = get_db()
        db.predictions.insert_one({
            "user_id": user.get("uid", "anonymous"),
            "user_email": user.get("email", ""),
            "input": request.model_dump(),
            "result": result,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        pass

    return result
