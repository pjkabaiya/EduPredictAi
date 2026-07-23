from fastapi import APIRouter

router = APIRouter()


@router.get("/about")
async def get_about():
    return {
        "project": "EduPredict AI",
        "description": (
            "EduPredict AI is a machine learning-powered web application "
            "that predicts university grades (A-F) for Kenyan students based on "
            "KCPE marks, KCSE grades, and behavioral/academic factors. "
            "The system helps educators identify at-risk students early "
            "and provide targeted interventions within the Kenyan education context."
        ),
        "objectives": [
            "Predict university grades (A-F) for Kenyan students accurately",
            "Analyse impact of KCPE and KCSE performance on university outcomes",
            "Provide actionable recommendations for academic improvement",
            "Enable early intervention for at-risk university students",
            "Deliver insights through an intuitive Kenyan-context dashboard",
        ],
        "problem_statement": (
            "Kenyan universities face challenges in identifying students who may need "
            "academic support before performance declines. Traditional methods rely on "
            "periodic exams, which may detect issues too late. EduPredict AI leverages "
            "machine learning to analyse KCPE marks, KCSE grades, study habits, and "
            "demographic factors to predict university grades, enabling proactive intervention "
            "tailored to the Kenyan education system."
        ),
        "ml_pipeline": {
            "data_collection": "Student KCPE results, KCSE transcripts, university records, survey data",
            "data_preprocessing": "Handling missing values, encoding KCSE grades ordinally, feature scaling",
            "feature_engineering": "KCSE-to-grade mapping, derived academic scores, interaction terms",
            "model_selection": "Random Forest, Gradient Boosting, SVM, Logistic Regression",
            "training": "80-20 train-test split, cross-validation, hyperparameter tuning",
            "evaluation": "Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix",
            "deployment": "FastAPI backend, React frontend, cloud hosting",
        },
        "technologies": {
            "frontend": ["React 19", "TypeScript", "TailwindCSS", "Framer Motion", "Recharts"],
            "backend": ["Python", "FastAPI", "Scikit-learn", "Pandas", "NumPy"],
            "tools": ["Git", "GitHub", "Vercel", "Render", "Jupyter Notebook"],
            "methodology": ["Agile", "CI/CD", "Test-Driven Development"],
        },
        "dataset": {
            "name": "Kenyan Student Performance Dataset",
            "source": "Synthesized Kenyan educational records (KCPE, KCSE, University)",
            "samples": 500,
            "features": 12,
            "target": "University Grade (A, B, C, D, F)",
        },
    }
