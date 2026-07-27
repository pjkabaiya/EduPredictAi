import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PredictionRequest, PredictionResponse } from '../types';
import { predictionService } from '../services/predictionService';

interface PredictionContextType {
  result: PredictionResponse | null;
  isPredicting: boolean;
  error: string | null;
  predict: (data: PredictionRequest) => Promise<void>;
  clear: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (data: PredictionRequest) => {
    setIsPredicting(true);
    setError(null);
    try {
      const res = await predictionService.predict(data);
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Prediction failed';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS') || msg.includes('ERR_FAILED')) {
        setError('Cannot reach the prediction server. The backend may be starting up (Render free tier cold start takes ~30s) or there may be a network issue. Please try again.');
      } else {
        setError(msg);
      }
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <PredictionContext.Provider value={{ result, isPredicting, error, predict, clear }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const ctx = useContext(PredictionContext);
  if (!ctx) throw new Error('usePrediction must be used within PredictionProvider');
  return ctx;
}
