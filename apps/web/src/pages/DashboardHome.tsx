import { StatCard } from '../components/dashboard/StatCard';
import { ClientsTable } from '../components/dashboard/ClientsTable';
import { Users, Activity, TrendingUp } from 'lucide-react';

import { useEffect, useState } from 'react';
import api from '../lib/api';

import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
    const { profile } = useAuth();
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
                <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome back, {profile?.full_name || 'Coach'}</h2>
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
            <div className="grid grid-cols-1 gap-8">
                <ClientsTable />
            </div>
        </div>
    );
};

export default DashboardHome;
