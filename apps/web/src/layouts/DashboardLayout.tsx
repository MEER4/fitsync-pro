import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-background-dark flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-dark border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-display font-bold text-primary">FitSync</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white">
                        <LayoutDashboard size={20} className="text-primary" />
                        <span>Overview</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <Users size={20} />
                        <span>Athletes</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <Activity size={20} />
                        <span>Workouts</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-white transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Placeholder for nested routes if we had them, or just content */}
                    <div className="bg-card-glass rounded-2xl p-8 border border-white/5">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">Dashboard Overview</h2>
                        <p className="text-gray-400">Welcome to your cosmic command center.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center">
                                    <span className="text-primary font-bold">Metric {i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
