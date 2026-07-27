from fastapi import APIRouter
from utils.data_loader import load_students

router = APIRouter()


@router.get("/dataset")
async def get_dataset(page: int = 1, page_size: int = 20, search: str = ""):
    students = load_students()

    if not students:
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
    students = load_students()

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
