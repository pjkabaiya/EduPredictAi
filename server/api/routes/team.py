from fastapi import APIRouter

router = APIRouter()

TEAM = [
    {
        "name": "Serena Muyeera",
        "student_id": "INTE/MG/3738/09/22",
        "role": "Project Manager & Research Lead",
        "bio": "Oversees project direction, coordinating team efforts and ensuring research aligns with academic standards and project goals for the mathematics performance prediction system.",
        "skills": ["Project Management", "Research", "Documentation", "Leadership"],
    },
    {
        "name": "Nicky Lawrence",
        "student_id": "INTE/M/0146/01/24",
        "role": "Data Engineer & EDA Lead",
        "bio": "Responsible for UCI dataset collection, cleaning, exploratory data analysis, and feature engineering to prepare high-quality training data for math performance prediction.",
        "skills": ["Data Engineering", "EDA", "Python", "Pandas", "Visualization"],
    },
    {
        "name": "Joseph Kihuria",
        "student_id": "INTE/M/1179/09/23",
        "role": "Machine Learning Engineer",
        "bio": "Develops and tunes machine learning models for accurate 3-class mathematics performance classification (High, Average, Low).",
        "skills": ["ML Algorithms", "Scikit-learn", "Model Tuning", "Evaluation"],
    },
    {
        "name": "John Peter Kabaiya",
        "student_id": "INTE/MK/1082/09/23",
        "role": "Deployment & Full Stack Integration Lead",
        "bio": "Architects the full stack application, frontend development, API integration, and deployment pipeline for the MathPredict AI platform.",
        "skills": ["React", "FastAPI", "DevOps", "Full Stack", "Integration"],
    },
]


@router.get("/team")
async def get_team():
    return {"members": TEAM}
