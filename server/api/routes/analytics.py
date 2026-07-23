from fastapi import APIRouter
import random

router = APIRouter()


def _generate_trend_data(days: int, base: float, variance: float):
    return [round(base + random.uniform(-variance, variance), 1) for _ in range(days)]


@router.get("/analytics")
async def get_analytics():
    return {
        "attendance_distribution": [
            {"range": "0-20%", "count": random.randint(5, 15)},
            {"range": "21-40%", "count": random.randint(10, 25)},
            {"range": "41-60%", "count": random.randint(20, 40)},
            {"range": "61-80%", "count": random.randint(40, 70)},
            {"range": "81-100%", "count": random.randint(60, 100)},
        ],
        "grade_distribution": [
            {"grade": "A", "count": random.randint(30, 50)},
            {"grade": "B", "count": random.randint(50, 80)},
            {"grade": "C", "count": random.randint(60, 100)},
            {"grade": "D", "count": random.randint(20, 40)},
            {"grade": "F", "count": random.randint(5, 20)},
        ],
        "gender_distribution": [
            {"gender": "Male", "count": random.randint(200, 300)},
            {"gender": "Female", "count": random.randint(200, 300)},
        ],
        "kcpe_vs_performance": [
            {"marks": m * 50, "grade": random.choice(["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"][:max(1, 12 - m // 2)])}
            for m in range(1, 11)
        ],
        "performance_categories": [
            {"category": "Grade A", "count": random.randint(50, 100)},
            {"category": "Grade B", "count": random.randint(100, 160)},
            {"category": "Grade C", "count": random.randint(120, 180)},
            {"category": "Grade D", "count": random.randint(40, 80)},
            {"category": "Grade F", "count": random.randint(10, 35)},
        ],
        "correlation_matrix": {
            "study_hours": {"attendance": 0.55, "kcpe": 0.48, "assignments": 0.62},
            "attendance": {"study_hours": 0.55, "kcpe": 0.42, "assignments": 0.58},
            "kcpe": {"study_hours": 0.48, "attendance": 0.42, "assignments": 0.52},
            "assignments": {"study_hours": 0.62, "attendance": 0.58, "kcpe": 0.52},
        },
        "feature_importance": [
            {"feature": "KCSE Grade", "importance": 0.25},
            {"feature": "Study Hours/Week", "importance": 0.20},
            {"feature": "KCPE Marks", "importance": 0.18},
            {"feature": "Attendance", "importance": 0.15},
            {"feature": "Prev Univ Grade", "importance": 0.12},
            {"feature": "Assignment Completion", "importance": 0.07},
            {"feature": "Sleep Hours", "importance": 0.03},
        ],
        "missing_values": [
            {"column": "Study Hours", "missing": random.randint(0, 5)},
            {"column": "Attendance", "missing": random.randint(0, 3)},
            {"column": "KCPE Marks", "missing": random.randint(0, 8)},
            {"column": "Assignment Rate", "missing": random.randint(0, 4)},
            {"column": "Sleep Hours", "missing": random.randint(0, 10)},
        ],
        "trends": {
            "daily_predictions": _generate_trend_data(30, 50, 15),
            "model_accuracy": _generate_trend_data(30, 90, 3),
            "avg_confidence": _generate_trend_data(30, 85, 5),
        },
    }
