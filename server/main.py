import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import health, prediction, analytics, dataset, model, team, about, dashboard, insights
from utils.database import connect_db, close_db
from utils.firebase_auth import init_firebase


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    connect_db()
    yield
    close_db()


app = FastAPI(
    title="MathPredict AI",
    description="Mathematics Performance Prediction System Using Machine Learning (UCI Student Performance Dataset)",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pjkabaiya.github.io",
        "https://edupredict-ai.vercel.app",
        "https://edupredictai-d30e0.firebaseapp.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(dataset.router, prefix="/api", tags=["Dataset"])
app.include_router(model.router, prefix="/api", tags=["Model"])
app.include_router(team.router, prefix="/api", tags=["Team"])
app.include_router(about.router, prefix="/api", tags=["About"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
