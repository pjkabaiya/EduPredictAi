# EduPredict AI

**Student Academic Performance Prediction System Using Machine Learning**

A production-quality AI web application for predicting student academic performance. Built with React 19, FastAPI, and scikit-learn.

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
│   │   └── assets/             # Static assets
│   ├── public/
│   └── ...config files
├── server/                     # FastAPI backend
│   ├── api/routes/             # API route handlers
│   ├── services/               # Business logic (PredictionService)
│   ├── models/                 # Placeholder for ML model files
│   └── utils/                  # Utility modules
└── README.md
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Recharts** for charts
- **Lucide React** for icons

### Backend
- **Python** with FastAPI
- **scikit-learn** for ML (future integration)
- **Pandas** / **NumPy** for data processing
- **joblib** for model serialization

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

The API starts at `http://localhost:8000`

API docs available at `http://localhost:8000/docs`

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
vercel --prod
```

### Backend (Render)

1. Push server code to GitHub
2. Create new Web Service on Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variable `VITE_API_URL` in Vercel to your Render URL

## Prediction Service

The prediction engine is fully isolated in `server/services/prediction_service.py`.

### Current Behavior
Returns realistic fake predictions for demonstration.

### Future Integration
To integrate the real ML model:
1. Place trained files in `server/models/`:
   - `student_model.pkl` - trained classifier
   - `scaler.pkl` - feature scaler
   - `label_encoder.pkl` - label encoder
2. The PredictionService automatically detects and uses real models
3. No frontend changes required

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/predict` | Make a prediction |
| GET | `/api/analytics` | Analytics data |
| GET | `/api/dataset` | Dataset records |
| GET | `/api/dataset/summary` | Dataset summary |
| GET | `/api/model` | Model performance |
| GET | `/api/team` | Team information |
| GET | `/api/about` | Project information |

## Project Status

**100% complete except for the ML engine.** Drop in trained `.pkl` files and the application immediately begins serving real predictions without any code changes.
