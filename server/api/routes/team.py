from fastapi import APIRouter

router = APIRouter()

TEAM = [
    {
        "name": "Serena Muyeera",
        "student_id": "INTE/MG/3738/09/22",
        "role": "Project Manager & Research Lead",
        "bio": "Oversees project direction, coordinating team efforts and ensuring research aligns with academic standards and project goals.",
        "skills": ["Project Management", "Research", "Documentation", "Leadership"],
    },
    {
        "name": "Nicky Lawrence",
        "student_id": "INTE/M/0146/01/24",
        "role": "Data Engineer & EDA Lead",
        "bio": "Responsible for data collection, cleaning, exploratory data analysis, and feature engineering to prepare high-quality training data.",
        "skills": ["Data Engineering", "EDA", "Python", "Pandas", "Visualization"],
    },
    {
        "name": "Joseph Kihuria",
        "student_id": "INTE/M/1179/09/23",
        "role": "Machine Learning Engineer",
        "bio": "Develops and tunes machine learning models for accurate student performance prediction and classification.",
        "skills": ["ML Algorithms", "Scikit-learn", "Model Tuning", "Evaluation"],
    },
    {
        "name": "John Peter Kabaiya",
        "student_id": "INTE/MK/1082/09/23",
        "role": "Deployment & Full Stack Integration Lead",
        "bio": "Architects the full stack application, frontend development, API integration, and deployment pipeline.",
        "skills": ["React", "FastAPI", "DevOps", "Full Stack", "Integration"],
    },
]


@router.get("/team")
async def get_team():
    return {"members": TEAM}
