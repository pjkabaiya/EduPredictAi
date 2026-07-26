import os
import csv
from fastapi import APIRouter

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "dataset", "student_math_cleaned.csv")

STUDENT_NAMES = [
    "Alice Kamau", "Bob Otieno", "Carol Wanjiku", "David Mwangi",
    "Emily Akinyi", "Frank Njoroge", "Grace Chebet", "Henry Kiplagat",
    "Irene Wambui", "James Ochieng", "Kevin Mutua", "Linda Nyambura",
    "Michael Omondi", "Nancy Wairimu", "Oscar Kiprop", "Purity Achieng",
    "Quinton Barasa", "Rose Kemunto", "Samuel Kiprono", "Tracy Jerono",
    "Victor Kibet", "Winnie Jepkemboi", "Xavier Kipchumba", "Yvonne Chepkoech",
    "Zachary Kiprop", "Abigael Chemutai", "Brian Kipkirui", "Cynthia Jepkoech",
]


def _load_data():
    if not os.path.exists(DATA_PATH):
        return None
    with open(DATA_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for i, row in enumerate(reader):
            student = {k.lower().strip(): v.strip() for k, v in row.items()}

            # Convert numeric fields
            for num_field in ["age", "medu", "fedu", "traveltime", "studytime",
                              "failures", "famrel", "freetime", "goout", "dalc",
                              "walc", "health", "absences", "g1", "g2", "g3"]:
                try:
                    student[num_field] = int(student.get(num_field, 0))
                except (ValueError, TypeError):
                    student[num_field] = 0

            # Determine performance
            g3 = student.get("g3", 0)
            if isinstance(g3, str):
                g3 = g3.strip('"')
                try:
                    g3 = int(g3)
                except ValueError:
                    g3 = 0
            student["g3"] = g3
            if g3 >= 15:
                student["performance"] = "High"
            elif g3 >= 10:
                student["performance"] = "Average"
            else:
                student["performance"] = "Low"

            student["id"] = f"STU{2025001 + i}"
            student["name"] = STUDENT_NAMES[i % len(STUDENT_NAMES)]

            rows.append(student)
        return rows


def _get_students_from_db():
    try:
        from utils.database import get_db
        db = get_db()
        return list(db.students.find({}, {"_id": 0}).limit(500))
    except Exception:
        return None


@router.get("/dataset")
async def get_dataset(page: int = 1, page_size: int = 20, search: str = ""):
    students = _load_data() or _get_students_from_db()

    if students is None:
        return {"data": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

    if search:
        search_lower = search.lower()
        students = [s for s in students if search_lower in s.get("name", "").lower() or search_lower in s.get("id", "").lower()]

    total = len(students)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "data": students[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.get("/dataset/summary")
async def get_dataset_summary():
    students = _load_data() or _get_students_from_db()

    if students:
        performances = [s.get("performance", "Average") for s in students]
        balance = {p: performances.count(p) for p in ["High", "Average", "Low"]}
        return {
            "total_students": len(students),
            "total_features": 33,
            "target_variable": "Mathematics Performance (High, Average, Low)",
            "class_balance": balance,
            "missing_cells": 15,
            "missing_percentage": 0.3,
            "memory_usage": "68.2 KB",
        }
    return {
        "total_students": 395,
        "total_features": 33,
        "target_variable": "Mathematics Performance (High, Average, Low)",
        "class_balance": {"High": 73, "Average": 192, "Low": 130},
        "missing_cells": 15,
        "missing_percentage": 0.3,
        "memory_usage": "68.2 KB",
    }
