import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter()
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "metrics.json")


@router.get("/model")
async def get_model_performance():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            return json.load(f)

    raise HTTPException(status_code=503, detail="Model metrics not available yet. Run train_model.py first.")
