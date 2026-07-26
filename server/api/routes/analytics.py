from fastapi import APIRouter
import random
import math

router = APIRouter()


@router.get("/analytics")
async def get_analytics():
    return {
        "performance_distribution": [
            {"category": "High Performance", "count": random.randint(80, 130)},
            {"category": "Average Performance", "count": random.randint(150, 220)},
            {"category": "Low Performance", "count": random.randint(70, 120)},
        ],
        "gender_performance": [
            {"gender": "Male", "high": random.randint(50, 80), "average": random.randint(70, 110), "low": random.randint(40, 70)},
            {"gender": "Female", "high": random.randint(30, 60), "average": random.randint(80, 120), "low": random.randint(30, 60)},
        ],
        "studytime_performance": [
            {"range": "< 2 hours", "avg_g3": round(random.uniform(7, 11), 1)},
            {"range": "2-5 hours", "avg_g3": round(random.uniform(10, 13), 1)},
            {"range": "5-10 hours", "avg_g3": round(random.uniform(12, 16), 1)},
            {"range": "> 10 hours", "avg_g3": round(random.uniform(14, 18), 1)},
        ],
        "failures_distribution": [
            {"failures": 0, "count": random.randint(200, 280)},
            {"failures": 1, "count": random.randint(60, 100)},
            {"failures": 2, "count": random.randint(30, 60)},
            {"failures": 3, "count": random.randint(10, 30)},
            {"failures": 4, "count": random.randint(5, 20)},
        ],
        "absences_distribution": [
            {"range": "0-5", "count": random.randint(100, 160)},
            {"range": "6-10", "count": random.randint(80, 120)},
            {"range": "11-20", "count": random.randint(50, 90)},
            {"range": "21-40", "count": random.randint(30, 60)},
            {"range": "> 40", "count": random.randint(10, 30)},
        ],
        "parental_education": [
            {"level": "None", "avg_g3": round(random.uniform(7, 10), 1)},
            {"level": "Primary", "avg_g3": round(random.uniform(9, 12), 1)},
            {"level": "Secondary", "avg_g3": round(random.uniform(11, 14), 1)},
            {"level": "Higher", "avg_g3": round(random.uniform(13, 16), 1)},
        ],
        "internet_access": [
            {"access": "Yes", "avg_g3": round(random.uniform(11, 14), 1)},
            {"access": "No", "avg_g3": round(random.uniform(8, 11), 1)},
        ],
        "correlation_matrix": {
            "G1": {"G2": 0.85, "G3": 0.80, "studytime": 0.35, "failures": -0.40, "absences": -0.25},
            "G2": {"G1": 0.85, "G3": 0.88, "studytime": 0.32, "failures": -0.38, "absences": -0.22},
            "G3": {"G1": 0.80, "G2": 0.88, "studytime": 0.30, "failures": -0.35, "absences": -0.20},
            "studytime": {"G1": 0.35, "G2": 0.32, "G3": 0.30, "failures": -0.20, "absences": -0.10},
            "failures": {"G1": -0.40, "G2": -0.38, "G3": -0.35, "studytime": -0.20, "absences": 0.15},
            "absences": {"G1": -0.25, "G2": -0.22, "G3": -0.20, "studytime": -0.10, "failures": 0.15},
        },
        "feature_importance": [
            {"feature": "G2 (Second Period Grade)", "importance": 0.32},
            {"feature": "G1 (First Period Grade)", "importance": 0.25},
            {"feature": "Number of Failures", "importance": 0.12},
            {"feature": "Study Time", "importance": 0.08},
            {"feature": "Absences", "importance": 0.06},
            {"feature": "Mother's Education", "importance": 0.04},
            {"feature": "Father's Education", "importance": 0.03},
            {"feature": "School Support", "importance": 0.03},
            {"feature": "Internet Access", "importance": 0.02},
            {"feature": "Health", "importance": 0.02},
        ],
        "missing_values": [
            {"column": "G1", "missing": 0},
            {"column": "G2", "missing": 0},
            {"column": "G3", "missing": 0},
            {"column": "Study Time", "missing": 2},
            {"column": "Failures", "missing": 1},
            {"column": "Absences", "missing": 0},
        ],
        "trends": {
            "daily_predictions": [round(random.uniform(30, 80), 1) for _ in range(30)],
            "model_accuracy": [round(random.uniform(85, 95), 1) for _ in range(30)],
            "avg_confidence": [round(random.uniform(78, 92), 1) for _ in range(30)],
        },
    }
