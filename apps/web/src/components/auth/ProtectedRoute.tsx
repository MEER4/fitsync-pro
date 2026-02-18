import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles?: ('coach' | 'member')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, profile, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background-dark text-primary">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles) {
        if (!profile) {
            // If we have a user but no profile (and not loading), something is wrong. 
            // Safest is to redirect to login or a generic dashboard.
            return <Navigate to="/dashboard" replace />;
        }

        if (!allowedRoles.includes(profile.role)) {
            // Redirect based on role if trying to access unauthorized area
            if (profile.role === 'member') {
                return <Navigate to="/dashboard/member" replace />;
            }
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};
