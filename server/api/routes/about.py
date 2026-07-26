from fastapi import APIRouter

router = APIRouter()


@router.get("/about")
async def get_about():
    return {
        "project": "MathPredict AI",
        "description": (
            "MathPredict AI is a machine learning-powered web application "
            "that predicts secondary school students' mathematics performance "
            "(High, Average, or Low) based on demographic, family, behavioural "
            "and educational factors from the UCI Student Performance dataset. "
            "The system helps educators identify at-risk students early and "
            "provide targeted interventions to improve mathematics outcomes."
        ),
        "objectives": [
            "Predict mathematics performance (High/Average/Low) accurately using ML",
            "Analyse impact of demographic and behavioural factors on math outcomes",
            "Identify at-risk students early for targeted intervention",
            "Provide actionable recommendations to improve mathematics performance",
            "Deliver insights through an interactive educational analytics dashboard",
        ],
        "problem_statement": (
            "Mathematics performance is a critical indicator of students' academic "
            "success and future opportunities. However, many secondary school students "
            "struggle with mathematics due to various demographic, family, behavioural "
            "and educational factors. Traditional assessment methods often identify "
            "performance issues too late for effective intervention. MathPredict AI "
            "leverages machine learning to analyse the UCI Student Performance dataset, "
            "considering factors such as study time, past failures, parental education, "
            "and family background to predict mathematics performance outcomes, enabling "
            "proactive and personalised educational support."
        ),
        "ml_pipeline": {
            "data_collection": "UCI Student Performance (Mathematics) dataset - student-mat.csv",
            "data_preprocessing": "Handling categorical variables (one-hot encoding), feature scaling, train-test split (80-20)",
            "feature_engineering": "Past academic performance (G1, G2), behavioural factors, demographic attributes",
            "model_selection": "Random Forest, Decision Tree, Logistic Regression, KNN, SVM (best model auto-selected)",
            "training": "5-fold cross-validation, hyperparameter tuning with GridSearchCV",
            "evaluation": "Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix",
            "deployment": "FastAPI backend, React frontend, GitHub Pages, Render cloud hosting",
        },
        "technologies": {
            "frontend": ["React 19", "TypeScript", "TailwindCSS", "Framer Motion", "Recharts"],
            "backend": ["Python", "FastAPI", "Scikit-learn", "Pandas", "NumPy"],
            "tools": ["Git", "GitHub", "GitHub Pages", "Render", "Jupyter Notebook"],
            "methodology": ["Agile", "CI/CD", "Test-Driven Development"],
        },
        "dataset": {
            "name": "UCI Student Performance (Mathematics) Dataset",
            "source": "UCI Machine Learning Repository",
            "samples": 395,
            "features": 33,
            "target": "Mathematics Performance (High, Average, Low)",
            "target_encoding": "G3 scores: 0-9 = Low, 10-14 = Average, 15-20 = High",
        },
    }
