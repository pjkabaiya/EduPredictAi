export interface PredictionRequest {
  sex: string;
  age: number;
  address: string;
  famsize: string;
  pstatus: string;
  medu: number;
  fedu: number;
  mjob: string;
  fjob: string;
  reason: string;
  guardian: string;
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: string;
  famsup: string;
  paid: string;
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  famrel: number;
  freetime: number;
  goout: number;
  dalc: number;
  walc: number;
  health: number;
  absences: number;
  g1: number;
  g2: number;
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  risk: string;
  probabilities: Record<string, number>;
  recommendations: string[];
}

export interface Student {
  id: string;
  school: string;
  sex: string;
  age: number;
  address: string;
  famsize: string;
  pstatus: string;
  medu: number;
  fedu: number;
  mjob: string;
  fjob: string;
  reason: string;
  guardian: string;
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: string;
  famsup: string;
  paid: string;
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  famrel: number;
  freetime: number;
  goout: number;
  dalc: number;
  walc: number;
  health: number;
  absences: number;
  g1: number;
  g2: number;
  g3: number;
  performance: string;
}

export interface DatasetResponse {
  data: Student[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DatasetSummary {
  total_students: number;
  total_features: number;
  target_variable: string;
  class_balance: Record<string, number>;
  missing_cells: number;
  missing_percentage: number;
  memory_usage: string;
}

export interface AnalyticsData {
  performance_distribution: { category: string; count: number }[];
  gender_performance: { gender: string; high: number; average: number; low: number }[];
  studytime_performance: { range: string; avg_g3: number }[];
  failures_distribution: { failures: number; count: number }[];
  absences_distribution: { range: string; count: number }[];
  parental_education: { level: string; avg_g3: number }[];
  internet_access: { access: string; avg_g3: number }[];
  correlation_matrix: Record<string, Record<string, number>>;
  feature_importance: { feature: string; importance: number }[];
  missing_values: { column: string; missing: number }[];
  trends: {
    daily_predictions: number[];
    model_accuracy: number[];
    avg_confidence: number[];
  };
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: number[][];
  classification_report: Record<string, { precision: number; recall: number; 'f1-score': number; support: number }>;
  model_info: {
    algorithm: string;
    best_model: string;
    candidates: string[];
    n_estimators: number;
    max_depth: number;
    training_samples: number;
    test_samples: number;
    training_time: string;
    inference_time: string;
    cross_validation_score: number;
  };
  feature_importance: { feature: string; importance: number }[];
}

export interface TeamMember {
  name: string;
  student_id: string;
  role: string;
  bio: string;
  skills: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export interface RecentPrediction {
  id: string;
  student_name: string;
  prediction: string;
  confidence: number;
  date: string;
  risk: string;
}
