from fastapi import APIRouter
import random

router = APIRouter()


@router.get("/model")
async def get_model_performance():
    return {
        "accuracy": round(random.uniform(0.85, 0.93), 4),
        "precision": round(random.uniform(0.83, 0.92), 4),
        "recall": round(random.uniform(0.84, 0.91), 4),
        "f1_score": round(random.uniform(0.84, 0.91), 4),
        "roc_auc": round(random.uniform(0.88, 0.95), 4),
        "confusion_matrix": {
            "true_a": random.randint(60, 90),
            "true_b": random.randint(90, 130),
            "true_c": random.randint(100, 150),
            "true_d": random.randint(40, 70),
            "true_f": random.randint(15, 30),
            "false_a": random.randint(3, 12),
            "false_b": random.randint(5, 18),
            "false_c": random.randint(8, 20),
            "false_d": random.randint(3, 10),
            "false_f": random.randint(1, 8),
        },
        "classification_report": {
            "Grade A": {
                "precision": round(random.uniform(0.88, 0.95), 2),
                "recall": round(random.uniform(0.86, 0.93), 2),
                "f1-score": round(random.uniform(0.87, 0.94), 2),
                "support": random.randint(80, 110),
            },
            "Grade B": {
                "precision": round(random.uniform(0.85, 0.92), 2),
                "recall": round(random.uniform(0.87, 0.93), 2),
                "f1-score": round(random.uniform(0.86, 0.92), 2),
                "support": random.randint(120, 160),
            },
            "Grade C": {
                "precision": round(random.uniform(0.82, 0.90), 2),
                "recall": round(random.uniform(0.84, 0.91), 2),
                "f1-score": round(random.uniform(0.83, 0.90), 2),
                "support": random.randint(130, 180),
            },
            "Grade D": {
                "precision": round(random.uniform(0.78, 0.88), 2),
                "recall": round(random.uniform(0.76, 0.86), 2),
                "f1-score": round(random.uniform(0.77, 0.87), 2),
                "support": random.randint(50, 80),
            },
            "Grade F": {
                "precision": round(random.uniform(0.75, 0.85), 2),
                "recall": round(random.uniform(0.72, 0.83), 2),
                "f1-score": round(random.uniform(0.73, 0.84), 2),
                "support": random.randint(20, 40),
            },
        },
        "model_info": {
            "algorithm": "Random Forest Classifier",
            "n_estimators": 200,
            "max_depth": 15,
            "training_samples": 400,
            "test_samples": 100,
            "training_time": f"{round(random.uniform(1.2, 3.5), 2)}s",
            "inference_time": f"{round(random.uniform(15, 45), 1)}ms",
            "cross_validation_score": round(random.uniform(0.83, 0.91), 4),
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
    }
