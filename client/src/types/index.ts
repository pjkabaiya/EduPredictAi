export interface PredictionRequest {
  age: number;
  gender: string;
  kcpe_marks: number;
  kcse_grade: string;
  university_previous_grade: string;
  study_hours_per_week: number;
  attendance_percentage: number;
  assignment_completion_rate: number;
  internet_access: string;
  parent_education: string;
  sleep_hours: number;
  extracurricular_activities: string;
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
  name: string;
  age: number;
  gender: string;
  kcpe_marks: number;
  kcse_grade: string;
  university_previous_grade: string;
  study_hours_per_week: number;
  attendance_percentage: number;
  assignment_completion_rate: number;
  internet_access: string;
  parent_education: string;
  sleep_hours: number;
  extracurricular_activities: string;
  predicted_grade: string;
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
  attendance_distribution: { range: string; count: number }[];
  grade_distribution: { grade: string; count: number }[];
  gender_distribution: { gender: string; count: number }[];
  kcpe_vs_performance: { marks: number; grade: string }[];
  performance_categories: { category: string; count: number }[];
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
  confusion_matrix: {
    true_a: number;
    true_b: number;
    true_c: number;
    true_d: number;
    true_f: number;
    false_a: number;
    false_b: number;
    false_c: number;
    false_d: number;
    false_f: number;
  };
  classification_report: Record<
    string,
    { precision: number; recall: number; 'f1-score': number; support: number }
  >;
  model_info: {
    algorithm: string;
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
