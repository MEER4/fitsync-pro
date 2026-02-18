import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardIndex from './pages/DashboardIndex';
import CreateRoutinePage from './pages/CreateRoutinePage';
import ExercisesPage from './pages/ExercisesPage';
import MembersPage from './pages/coach/MembersPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import MemberDashboard from './pages/member/MemberDashboard';
import MemberHistoryPage from './pages/member/MemberHistoryPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

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

              {/* Coach Routes */}
              <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
                <Route index element={<DashboardHome />} />
                <Route path="routines/new" element={<CreateRoutinePage />} />
                <Route path="exercises" element={<ExercisesPage />} />
                <Route path="members" element={<MembersPage />} />
              </Route>

              {/* Member Routes */}
              <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="member" element={<MemberDashboard />} />
                <Route path="history" element={<MemberHistoryPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
