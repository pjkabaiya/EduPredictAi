import type { PredictionRequest, PredictionResponse } from '../types';
import { api } from './api';

export const predictionService = {
  predict: (data: PredictionRequest): Promise<PredictionResponse> =>
    api.post<PredictionResponse>('/predict', data),
};
