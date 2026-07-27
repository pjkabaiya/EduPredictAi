import os
import json
from fastapi import APIRouter
from utils.data_loader import load_students

router = APIRouter()
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "metrics.json")


@router.get("/insights")
async def get_insights():
    students = load_students()
    total = len(students)
    high = sum(1 for s in students if s["performance"] == "High")
    avg = sum(1 for s in students if s["performance"] == "Average")
    low = sum(1 for s in students if s["performance"] == "Low")

    # Model accuracy from metrics
    model_accuracy = 81.0
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            metrics = json.load(f)
            model_accuracy = round(metrics.get("accuracy", 0.81) * 100, 1)

    # Feature importance from metrics or fallback
    feature_importance = [
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
    ]
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            metrics = json.load(f)
            fi = metrics.get("feature_importance")
            if fi:
                feature_map = {
                    "g2": "G2 (Second Period Grade)", "g1": "G1 (First Period Grade)",
                    "failures": "Number of Past Failures", "studytime": "Weekly Study Time",
                    "absences": "School Absences", "medu": "Mother's Education Level",
                    "fedu": "Father's Education Level", "schoolsup": "School Educational Support",
                    "internet": "Internet Access at Home", "health": "Student Health Status",
                    "age": "Age", "traveltime": "Travel Time", "famrel": "Family Relations",
                    "freetime": "Free Time", "goout": "Going Out", "dalc": "Weekday Alcohol",
                    "walc": "Weekend Alcohol", "reason": "Reason for School Choice",
                    "fjob": "Father's Job", "mjob": "Mother's Job", "guardian": "Guardian",
                    "famsize": "Family Size", "pstatus": "Parents Cohabitation Status",
                    "school": "School", "sex": "Gender", "address": "Address Type",
                    "nursery": "Nursery Attendance", "higher": "Wants Higher Education",
                    "romantic": "In Romantic Relationship", "activities": "Extracurricular Activities",
                }
                feature_importance = [
                    {"feature": feature_map.get(f["feature"], f["feature"].title()), "importance": round(f["importance"], 2)}
                    for f in fi[:10]
                ]

    # Compute risk factors from actual data
    avg_failures = sum(s.get("failures", 0) for s in students) / max(total, 1)
    avg_studytime = sum(s.get("studytime", 0) for s in students) / max(total, 1)
    avg_absences = sum(s.get("absences", 0) for s in students) / max(total, 1)
    avg_g1 = sum(s.get("g1", 0) for s in students) / max(total, 1)

    risk_factors = [
        {
            "factor": "Multiple Past Failures (>{:.0f})".format(max(1, round(avg_failures))),
            "impact": "High" if avg_failures > 1 else "Medium",
            "severity": min(95, round(avg_failures * 30)),
        },
        {
            "factor": "Low Study Time (<{:.0f} hrs/week)".format(max(1, round(avg_studytime))),
            "impact": "High" if avg_studytime < 2 else "Medium",
            "severity": min(90, max(40, 100 - round(avg_studytime * 15))),
        },
        {
            "factor": "High Absences (>{:.0f})".format(max(5, round(avg_absences))),
            "impact": "High" if avg_absences > 10 else "Medium",
            "severity": min(85, round(avg_absences * 3)),
        },
        {
            "factor": "Low First Period Grade (<{:.0f})".format(max(5, round(avg_g1))),
            "impact": "Medium" if avg_g1 < 10 else "Low",
            "severity": min(75, max(30, 100 - round(avg_g1 * 5))),
        },
        {
            "factor": "No Internet Access at Home",
            "impact": "Medium",
            "severity": round(60 - (sum(1 for s in students if s.get("internet") == "yes") / max(total, 1)) * 30),
        },
        {
            "factor": "Low Parental Education",
            "impact": "Low",
            "severity": round(50 - (sum(s.get("medu", 0) + s.get("fedu", 0) for s in students) / max(total * 2, 1)) * 5),
        },
    ]

    recommendations = [
        'Increase weekly study time to at least 5-10 hours for better mathematics performance',
        'Address past academic failures through remedial support and tutoring',
        'Maintain consistent school attendance above 95% to stay aligned with coursework',
        'Utilise internet resources and online mathematics practice platforms',
        'Seek school educational support programs and teacher consultations',
        'Establish a regular study routine with focused mathematics practice',
        'Engage family educational support for homework and learning activities',
    ]

    return {
        "feature_importance": feature_importance,
        "risk_factors": risk_factors,
        "recommendations": recommendations,
        "model_stats": {
            "accuracy": model_accuracy,
            "performance_classes": 3,
            "features_analyzed": 33,
        },
        "class_balance": {
            "High": high,
            "Average": avg,
            "Low": low,
        },
    }
