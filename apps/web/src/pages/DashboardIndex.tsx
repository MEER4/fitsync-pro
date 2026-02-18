import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardHome from './DashboardHome';

const DashboardIndex = () => {
    const { profile, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-10 text-white">Loading...</div>; // Simple loading state
    }

    if (profile?.role === 'member') {
        return <Navigate to="/dashboard/member" replace />;
    }

    if (profile?.role === 'coach') {
        return <DashboardHome />;
    }

    return <div className="p-10 text-white">Unknown role: {profile?.role}</div>;
};

export default DashboardIndex;
