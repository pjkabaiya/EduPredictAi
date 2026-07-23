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
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setIsPredicting(false);
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
