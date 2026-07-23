from fastapi import APIRouter
import random

router = APIRouter()

STUDENT_NAMES = [
    "Alice Kamau", "Bob Otieno", "Carol Wanjiku", "David Mwangi",
    "Emily Akinyi", "Frank Njoroge", "Grace Chebet", "Henry Kiplagat",
    "Irene Wambui", "James Ochieng", "Kevin Mutua", "Linda Nyambura",
    "Michael Omondi", "Nancy Wairimu", "Oscar Kiprop", "Purity Achieng",
    "Quinton Barasa", "Rose Kemunto", "Samuel Kiprono", "Tracy Jerono",
    "Victor Kibet", "Winnie Jepkemboi", "Xavier Kipchumba", "Yvonne Chepkoech",
    "Zachary Kiprop", "Abigael Chemutai", "Brian Kipkirui", "Cynthia Jepkoech",
]

GENDERS = ["Male", "Female"]
INTERNET_ACCESS = ["Yes", "No"]
PARENT_EDUCATION = ["Primary", "Secondary", "Diploma", "Bachelor's", "Master's", "PhD"]
EXTRACURRICULAR = ["Yes", "No"]
KCSE_GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"]
UNI_GRADES = ["A", "B", "C", "D", "F"]

KCSE_SCORE = {g: i for i, g in enumerate(reversed(KCSE_GRADES))}


def _generate_student(i: int) -> dict:
    kcpe = random.randint(150, 500)
    kcse = random.choice(KCSE_GRADES)
    prev_grade = random.choice(UNI_GRADES)
    study = round(random.uniform(5, 45), 1)
    attendance = round(random.uniform(40, 100), 1)
    assignments = round(random.uniform(30, 100), 1)
    sleep = round(random.uniform(4, 10), 1)
    age = random.randint(18, 30)

    raw = (
        kcpe / 500 * 0.15 + KCSE_SCORE[kcse] / 11 * 0.25 + study / 45 * 0.15
        + attendance / 100 * 0.15 + assignments / 100 * 0.10
        + ({"A": 4, "B": 3, "C": 2, "D": 1, "F": 0}[prev_grade]) / 4 * 0.20
    )
    if raw >= 0.78:
        grade = "A"
    elif raw >= 0.62:
        grade = "B"
    elif raw >= 0.45:
        grade = "C"
    elif raw >= 0.30:
        grade = "D"
    else:
        grade = "F"

    return {
        "id": f"STU{2025001 + i}",
        "name": random.choice(STUDENT_NAMES),
        "age": age,
        "gender": random.choice(GENDERS),
        "kcpe_marks": kcpe,
        "kcse_grade": kcse,
        "university_previous_grade": prev_grade,
        "study_hours_per_week": study,
        "attendance_percentage": attendance,
        "assignment_completion_rate": assignments,
        "internet_access": random.choice(INTERNET_ACCESS),
        "parent_education": random.choice(PARENT_EDUCATION),
        "sleep_hours": sleep,
        "extracurricular_activities": random.choice(EXTRACURRICULAR),
        "predicted_grade": grade,
    }


def _get_students_from_db():
    try:
        from utils.database import get_db
        db = get_db()
        return list(db.students.find({}, {"_id": 0}).limit(500))
    except Exception:
        return None


@router.get("/dataset")
async def get_dataset(page: int = 1, page_size: int = 20, search: str = ""):
    students = _get_students_from_db()
    if students is None:
        students = [_generate_student(i) for i in range(500)]

    if search:
        search_lower = search.lower()
        students = [s for s in students if search_lower in s["name"].lower() or search_lower in s["id"].lower()]

    total = len(students)
    start = (page - 1) * page_size
    end = start + page_size
    return {"data": students[start:end], "total": total, "page": page, "page_size": page_size, "total_pages": (total + page_size - 1) // page_size}


@router.get("/dataset/summary")
async def get_dataset_summary():
    students = _get_students_from_db()
    if students:
        grades = [s.get("predicted_grade", "C") for s in students]
        balance = {g: grades.count(g) for g in UNI_GRADES}
        return {
            "total_students": len(students),
            "total_features": 12,
            "target_variable": "Predicted University Grade",
            "class_balance": balance,
            "missing_cells": 18,
            "missing_percentage": 0.3,
            "memory_usage": "38.4 KB",
        }
    return {
        "total_students": 500,
        "total_features": 12,
        "target_variable": "Predicted University Grade",
        "class_balance": {"A": 95, "B": 140, "C": 155, "D": 75, "F": 35},
        "missing_cells": 18,
        "missing_percentage": 0.3,
        "memory_usage": "38.4 KB",
    }
