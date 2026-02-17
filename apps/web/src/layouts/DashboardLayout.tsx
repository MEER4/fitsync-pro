import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-background-dark text-white overflow-hidden font-body">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-background-dark relative">
                {/* Ambient background effect */}
                <div className="absolute inset-0 bg-nebula-gradient pointer-events-none opacity-50" />

                <div className="relative z-10 p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
