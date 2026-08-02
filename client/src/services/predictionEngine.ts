import type { PredictionRequest, PredictionResponse } from '../types';

interface TreeData {
  children_left: number[];
  children_right: number[];
  feature: number[];
  threshold: number[];
  values: number[][][];
}

interface ModelData {
  model_type: string;
  feature_columns: string[];
  tree: TreeData;
  scaler_mean: number[];
  scaler_scale: number[];
  target_classes: string[];
  feature_encoders: Record<string, string[]>;
}

const MODEL_URL = `${import.meta.env.BASE_URL}model.json`;

let modelCache: ModelData | null = null;

async function loadModel(): Promise<ModelData> {
  if (modelCache) return modelCache;
  const res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error('Model not loaded');
  modelCache = await res.json() as ModelData;
  return modelCache;
}

function encodeValue(value: string, classes: string[]): number {
  const idx = classes.indexOf(value);
  return idx >= 0 ? idx : 0;
}

function buildFeatureVector(data: PredictionRequest, model: ModelData): number[] {
  const full: Record<string, string | number> = {
    school: 'GP',
    sex: data.sex,
    age: data.age,
    address: data.address,
    famsize: data.famsize,
    pstatus: data.pstatus,
    medu: data.medu,
    fedu: data.fedu,
    mjob: data.mjob,
    fjob: data.fjob,
    reason: data.reason,
    guardian: data.guardian,
    traveltime: data.traveltime,
    studytime: data.studytime,
    failures: data.failures,
    schoolsup: data.schoolsup,
    famsup: data.famsup,
    paid: data.paid,
    activities: data.activities,
    nursery: data.nursery,
    higher: data.higher,
    internet: data.internet,
    romantic: data.romantic,
    famrel: data.famrel,
    freetime: data.freetime,
    goout: data.goout,
    dalc: data.dalc,
    walc: data.walc,
    health: data.health,
    absences: data.absences,
    g1: data.g1,
    g2: data.g2,
  };

  return model.feature_columns.map((col) => {
    const raw = full[col];
    const encoders = model.feature_encoders[col];
    if (encoders) {
      return encodeValue(String(raw), encoders);
    }
    return Number(raw) || 0;
  });
}

function scale(features: number[], model: ModelData): number[] {
  return features.map((v, i) => {
    const mean = model.scaler_mean[i];
    const scaleVal = model.scaler_scale[i] || 1;
    return (v - mean) / scaleVal;
  });
}

function walkTree(scaled: number[], model: ModelData): { prediction: string; probs: Record<string, number> } {
  const { tree, target_classes } = model;
  let node = 0;
  let guard = 0;
  while (tree.children_left[node] !== -1 && guard < 1000) {
    const featIdx = tree.feature[node];
    if (scaled[featIdx] <= tree.threshold[node]) {
      node = tree.children_left[node];
    } else {
      node = tree.children_right[node];
    }
    guard++;
  }

  const counts = tree.values[node][0];
  const total = counts.reduce((a: number, b: number) => a + b, 0) || 1;
  const probs: Record<string, number> = {};
  target_classes.forEach((cls, i) => {
    probs[cls] = Math.round((counts[i] / total) * 1000) / 10;
  });

  let bestIdx = 0;
  target_classes.forEach((_, i) => {
    if (probs[target_classes[i]] > probs[target_classes[bestIdx]]) bestIdx = i;
  });

  return { prediction: target_classes[bestIdx], probs };
}

export function hasLocalModel(): boolean {
  return typeof modelCache !== 'undefined';
}

export async function predictLocal(data: PredictionRequest): Promise<PredictionResponse> {
  const model = await loadModel();
  const features = buildFeatureVector(data, model);
  const scaled = scale(features, model);
  const { prediction, probs } = walkTree(scaled, model);

  const confidence = probs[prediction] ?? 0;
  const risk = prediction === 'High Performance' ? 'Low' : prediction === 'Average Performance' ? 'Medium' : 'High';

  const recommendations: string[] = [];
  if (data.failures > 0) recommendations.push('Address past academic failures by identifying weak areas and seeking tutoring support.');
  if (data.studytime < 2) recommendations.push('Increase weekly study time to at least 2-5 hours for better subject mastery.');
  if (data.absences > 10) recommendations.push('Reduce school absences to stay aligned with coursework and avoid falling behind.');
  if (data.internet === 'no') recommendations.push('Utilize school computer labs and library resources to compensate for lack of internet access at home.');
  if (data.health < 3) recommendations.push('Prioritize physical and mental well-being — good health positively impacts academic performance.');
  if (prediction === 'High Performance') recommendations.push('Maintain current study habits and take on advanced challenges to continue excelling.');
  else if (prediction === 'Average Performance') recommendations.push('Target specific weaker subjects or skills to push your performance into the high range.');
  else recommendations.push('Seek academic advising and create a structured improvement plan with measurable goals.');
  if (!recommendations.length) recommendations.push('Continue monitoring your academic progress and stay consistent with your current approach.');

  return {
    prediction,
    confidence,
    risk,
    probabilities: probs,
    recommendations,
  };
}
