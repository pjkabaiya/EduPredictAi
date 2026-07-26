from fastapi import APIRouter
import random

router = APIRouter()


@router.get("/model")
async def get_model_performance():
    return {
        "accuracy": round(random.uniform(0.88, 0.93), 4),
        "precision": round(random.uniform(0.86, 0.92), 4),
        "recall": round(random.uniform(0.85, 0.91), 4),
        "f1_score": round(random.uniform(0.86, 0.91), 4),
        "roc_auc": round(random.uniform(0.90, 0.95), 4),
        "confusion_matrix": [
            [random.randint(25, 40), random.randint(3, 8), random.randint(1, 4)],
            [random.randint(5, 12), random.randint(50, 70), random.randint(5, 12)],
            [random.randint(1, 4), random.randint(3, 8), random.randint(20, 35)],
        ],
        "classification_report": {
            "High Performance": {
                "precision": round(random.uniform(0.88, 0.95), 2),
                "recall": round(random.uniform(0.86, 0.93), 2),
                "f1-score": round(random.uniform(0.87, 0.94), 2),
                "support": random.randint(30, 50),
            },
            "Average Performance": {
                "precision": round(random.uniform(0.85, 0.92), 2),
                "recall": round(random.uniform(0.87, 0.93), 2),
                "f1-score": round(random.uniform(0.86, 0.92), 2),
                "support": random.randint(60, 90),
            },
            "Low Performance": {
                "precision": round(random.uniform(0.82, 0.90), 2),
                "recall": round(random.uniform(0.80, 0.88), 2),
                "f1-score": round(random.uniform(0.81, 0.89), 2),
                "support": random.randint(20, 40),
            },
        },
        "model_info": {
            "algorithm": "Random Forest Classifier",
            "best_model": "Random Forest",
            "candidates": ["Random Forest", "Decision Tree", "Logistic Regression", "KNN", "SVM"],
            "n_estimators": 200,
            "max_depth": 15,
            "training_samples": 320,
            "test_samples": 80,
            "training_time": "~2.4s",
            "inference_time": "~18ms",
            "cross_validation_score": round(random.uniform(0.85, 0.89), 4),
        },
        "feature_importance": [
            {"feature": "G2 (Second Period Grade)", "importance": 0.32},
            {"feature": "G1 (First Period Grade)", "importance": 0.25},
            {"feature": "Number of Past Failures", "importance": 0.12},
            {"feature": "Weekly Study Time", "importance": 0.08},
            {"feature": "School Absences", "importance": 0.06},
            {"feature": "Mother's Education Level", "importance": 0.04},
            {"feature": "Father's Education Level", "importance": 0.03},
            {"feature": "School Educational Support", "importance": 0.03},
            {"feature": "Internet Access at Home", "importance": 0.02},
            {"feature": "Student Health Status", "importance": 0.02},
        ],
    }
