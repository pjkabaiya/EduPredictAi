from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.prediction_service import PredictionService
from utils.database import get_db
from utils.firebase_auth import verify_token
from datetime import datetime, timezone

router = APIRouter()
prediction_service = PredictionService()


class PredictionRequest(BaseModel):
    school: str
    sex: str
    age: int
    address: str
    famsize: str
    pstatus: str
    medu: int
    fedu: int
    mjob: str
    fjob: str
    reason: str
    guardian: str
    traveltime: int
    studytime: int
    failures: int
    schoolsup: str
    famsup: str
    paid: str
    activities: str
    nursery: str
    higher: str
    internet: str
    romantic: str
    famrel: int
    freetime: int
    goout: int
    dalc: int
    walc: int
    health: int
    absences: int
    g1: int
    g2: int


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
