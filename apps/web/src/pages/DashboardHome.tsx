import { StatCard } from '../components/dashboard/StatCard';
import { ClientsTable } from '../components/dashboard/ClientsTable';
import { Users, Activity, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DashboardHome = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome back, Coach</h2>
                <p className="text-gray-400">Here's what's happening in your studio today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Active Athletes"
                    value="24"
                    icon={Users}
                    trend="+12% from last month"
                    color="bg-primary/20 text-primary"
                />
                <StatCard
                    title="Monthly Revenue"
                    value="$3,200"
                    icon={TrendingUp}
                    trend="+8% from last month"
                    color="bg-green-500/20 text-green-400"
                />
                <StatCard
                    title="Completion Rate"
                    value="85%"
                    icon={Activity}
                    trend="+2% from last week"
                    color="bg-purple-500/20 text-purple-400"
                />
            </div>

            {/* Active Workout CTA & Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-surface-dark to-black border-primary/20 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all text-left">
                    <Link to="/workout/test" className="absolute inset-0 z-10" />
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={120} />
                    </div>
                    <div className="relative z-0">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">Start Active Workout</h3>
                        <p className="text-gray-400 mb-6">Launch the immersive tracker for your daily session.</p>
                        <Button variant="primary" className="shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            <Play size={18} /> Launch Session
                        </Button>
                    </div>
                </Card>

                <ClientsTable />
            </div>
        </div>
    );
};

export default DashboardHome;
