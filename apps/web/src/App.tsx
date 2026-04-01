import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardIndex from './pages/DashboardIndex';
import CreateRoutinePage from './pages/CreateRoutinePage';
import EditRoutinePage from './pages/EditRoutinePage';
import RoutinesPage from './pages/coach/RoutinesPage';
import ExercisesPage from './pages/ExercisesPage';
import MembersPage from './pages/coach/MembersPage';
import MemberProfilePage from './pages/coach/MemberProfilePage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import MemberDashboard from './pages/member/MemberDashboard';
import MemberCalendarPage from './pages/member/MemberCalendarPage';
import MemberHistoryPage from './pages/member/MemberHistoryPage';
import SettingsPage from './pages/SettingsPage';
import CoachDietPage from './pages/coach/CoachDietPage';
import MemberDietPage from './pages/member/MemberDietPage';
import LeadsPage from './pages/coach/LeadsPage';
import DietTemplatesPage from './pages/coach/DietTemplatesPage';
import CreateDietTemplatePage from './pages/coach/CreateDietTemplatePage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme(); // Initialize theme on app load

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/workout/:routineId" element={<WorkoutSessionPage />} />

              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Coach Routes - Admin also has access */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="routines" element={<RoutinesPage />} />
                  <Route path="routines/new" element={<CreateRoutinePage />} />
                  <Route path="routines/:routineId/edit" element={<EditRoutinePage />} />
                  <Route path="diet-templates" element={<DietTemplatesPage />} />
                  <Route path="diet-templates/new" element={<CreateDietTemplatePage />} />
                  <Route path="diet-templates/:templateId/edit" element={<CreateDietTemplatePage />} />
                  <Route path="exercises" element={<ExercisesPage />} />
                  <Route path="members" element={<MembersPage />} />
                  <Route path="members/:memberId" element={<MemberProfilePage />} />
                  <Route path="members/:memberId/diet" element={<CoachDietPage />} />
                  <Route path="leads" element={<LeadsPage />} />
                </Route>

                {/* Member Routes */}
                <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                  <Route path="member" element={<MemberDashboard />} />
                  <Route path="calendar" element={<MemberCalendarPage />} />
                  <Route path="history" element={<MemberHistoryPage />} />
                  <Route path="nutrition" element={<MemberDietPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
