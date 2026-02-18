import { StatCard } from '../components/dashboard/StatCard';
import { ClientsTable } from '../components/dashboard/ClientsTable';
import { Users, Activity, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import { useEffect, useState } from 'react';
import api from '../lib/api';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        activeAthletes: 0,
        completionRate: 0,
        monthlyRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                    value={isLoading ? "..." : stats.activeAthletes.toString()}
                    icon={Users}
                    trend="Total Members"
                    color="bg-primary/20 text-primary"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={isLoading ? "..." : `$${stats.monthlyRevenue}`}
                    icon={TrendingUp}
                    trend="Estimated (Active * $50)"
                    color="bg-green-500/20 text-green-400"
                />
                <StatCard
                    title="Completion Rate"
                    value={isLoading ? "..." : `${stats.completionRate}%`}
                    icon={Activity}
                    trend="All Time"
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
