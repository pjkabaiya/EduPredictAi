# MathPredict AI

**Student Mathematics Performance Prediction System Using Machine Learning**

A production-quality AI web application for predicting secondary school students' mathematics performance (High, Average, Low) based on the UCI Student Performance (Mathematics) dataset. Built with React 19, FastAPI, and scikit-learn.

## Architecture

```
EduPredictAI/
├── client/                     # React frontend (Vite + TypeScript + TailwindCSS)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route pages
│   │   ├── contexts/           # React Context providers
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── firebase.ts         # Firebase Auth integration
│   ├── vite.config.ts
│   └── package.json
├── server/                     # FastAPI backend
│   ├── api/routes/             # API route handlers (7 endpoints)
│   ├── services/               # Business logic (PredictionService)
│   ├── models/                 # Placeholder for trained .pkl files
│   └── utils/                  # Database & Firebase auth utilities
└── README.md
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 6** for build tooling
- **TailwindCSS** for styling (dark/light mode)
- **Framer Motion** for animations
- **Recharts** for interactive charts
- **Lucide React** for icons
- **Firebase Auth** for authentication

### Backend
- **Python** with FastAPI
- **scikit-learn** for ML (Random Forest, Decision Tree, Logistic Regression, KNN, SVM)
- **Pandas** / **NumPy** for data processing
- **joblib** for model serialization
- **PyMongo** for MongoDB Atlas integration
- **Firebase Admin** for token verification

## Dataset

**UCI Student Performance (Mathematics) Dataset** — 395 student records with 33 attributes:

| Category | Features |
|----------|----------|
| Demographics | School, Sex, Age, Address, Family Size, Parent Status |
| Family Background | Mother/Father Education & Job, Family Relationships |
| Academic | Study Time, Failures, Travel Time, School Support |
| Personal | Internet Access, Romantic, Going Out, Alcohol Consumption |
| Health | Current Health Status, Absences |
| Prior Grades | G1 (First Period), G2 (Second Period) |

**Target:** G3 (Final Grade 0-20) classified as:
- **High Performance:** G3 ≥ 15
- **Average Performance:** G3 10-14
- **Low Performance:** G3 0-9

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`

### Backend Setup

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API starts at `http://localhost:8000` — API docs at `http://localhost:8000/docs`

## Deployment

### Frontend (GitHub Pages)

The frontend auto-deploys via GitHub Actions when changes are pushed to `master`:
```bash
git push origin master
```

### Backend (Render)

1. Push server code to GitHub
2. Create new Web Service on Render
3. Set build command: `pip install -r server/requirements.txt`
4. Set start command: `cd server && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables: `MONGO_URI`, `MONGO_DB_NAME`, `FIREBASE_SERVICE_ACCOUNT_JSON`

## Prediction Service

The prediction engine is isolated in `server/services/prediction_service.py`.

### Current Behavior
Returns heuristic-based predictions based on study time, past failures, absences, prior grades, parental education, school support, internet access, and health factors.

### Real Model Integration
To use a trained ML model:
1. Place trained files in `server/models/`:
   - `student_model.pkl` — trained classifier
   - `scaler.pkl` — feature scaler
   - `label_encoder.pkl` — label encoder (High, Average, Low)
2. The PredictionService auto-detects and switches to real models
3. No frontend changes required

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (MathPredict AI) |
| POST | `/api/predict` | Predict mathematics performance (33 features) |
| GET | `/api/analytics` | Performance analytics & distributions |
| GET | `/api/dataset` | Paginated student dataset records |
| GET | `/api/dataset/summary` | Dataset summary statistics |
| GET | `/api/model` | ML model performance metrics |
| GET | `/api/team` | Team member information |
| GET | `/api/about` | Project information & documentation |

## Project Status

**100% complete except for the ML engine.** Drop in trained `.pkl` files and the application immediately begins serving real predictions without any code changes.
