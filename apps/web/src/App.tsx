import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CreateRoutinePage from './pages/CreateRoutinePage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="routines/new" element={<CreateRoutinePage />} />
          <Route path="exercises" element={<ExercisesPage />} />
        </Route>

        {/* Active Workout Route */}
        <Route path="/workout/:routineId" element={<WorkoutSessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
