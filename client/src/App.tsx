import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PredictionProvider } from './contexts/PredictionContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionPage } from './pages/PredictionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <PredictionProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/prediction" element={<PredictionPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/dataset" element={<DatasetExplorerPage />} />
                  <Route path="/model-performance" element={<ModelPerformancePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/ai-insights" element={<AIInsightsPage />} />
                </Route>
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AnimatePresence>
          </PredictionProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
