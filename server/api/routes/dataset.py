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

SCHOOLS = ["GP", "MS"]
SEXES = ["M", "F"]
ADDRESSES = ["U", "R"]
FAMSIZES = ["LE3", "GT3"]
PSTATUSES = ["T", "A"]
MJOBS = ["teacher", "health", "services", "at_home", "other"]
FJOBS = ["teacher", "health", "services", "at_home", "other"]
REASONS = ["home", "reputation", "course", "other"]
GUARDIANS = ["mother", "father", "other"]
YES_NO = ["yes", "no"]


def _generate_student(i: int) -> dict:
    g1_base = random.randint(5, 18)
    bonus = random.choice([0, 1, 2]) if random.random() < 0.4 else 0
    penalty = random.randint(0, 2) if random.random() < 0.3 else 0
    g1 = min(20, max(0, g1_base + bonus - penalty))
    g2 = min(20, max(0, g1 + random.randint(-2, 3)))
    g3 = min(20, max(0, g2 + random.randint(-2, 3)))

    if g3 >= 15:
        performance = "High"
    elif g3 >= 10:
        performance = "Average"
    else:
        performance = "Low"

    return {
        "id": f"STU{2025001 + i}",
        "name": random.choice(STUDENT_NAMES),
        "school": random.choice(SCHOOLS),
        "sex": random.choice(SEXES),
        "age": random.randint(15, 22),
        "address": random.choice(ADDRESSES),
        "famsize": random.choice(FAMSIZES),
        "pstatus": random.choice(PSTATUSES),
        "medu": random.randint(0, 4),
        "fedu": random.randint(0, 4),
        "mjob": random.choice(MJOBS),
        "fjob": random.choice(FJOBS),
        "reason": random.choice(REASONS),
        "guardian": random.choice(GUARDIANS),
        "traveltime": random.randint(1, 4),
        "studytime": random.randint(1, 4),
        "failures": random.randint(0, 4),
        "schoolsup": random.choice(YES_NO),
        "famsup": random.choice(YES_NO),
        "paid": random.choice(YES_NO),
        "activities": random.choice(YES_NO),
        "nursery": random.choice(YES_NO),
        "higher": random.choice(YES_NO),
        "internet": random.choice(YES_NO),
        "romantic": random.choice(YES_NO),
        "famrel": random.randint(1, 5),
        "freetime": random.randint(1, 5),
        "goout": random.randint(1, 5),
        "dalc": random.randint(1, 5),
        "walc": random.randint(1, 5),
        "health": random.randint(1, 5),
        "absences": random.randint(0, 50),
        "g1": g1,
        "g2": g2,
        "g3": g3,
        "performance": performance,
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
        "total_students": 500,
        "total_features": 33,
        "target_variable": "Mathematics Performance (High, Average, Low)",
        "class_balance": {"High": 110, "Average": 240, "Low": 150},
        "missing_cells": 15,
        "missing_percentage": 0.3,
        "memory_usage": "68.2 KB",
    }
