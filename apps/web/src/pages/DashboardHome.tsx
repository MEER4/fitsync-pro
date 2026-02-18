// import { StatCard } from '../components/dashboard/StatCard'; // Removed as we use custom styled cards now
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
                {/* Active Athletes Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-light border border-white/5 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-primary/50">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-primary">
                            <Users className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">Active Athletes</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-white">
                                {isLoading ? "..." : stats.activeAthletes}
                            </h3>
                            <span className="text-gray-400 text-sm">Total Members</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-light border border-white/5 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-green-500/50">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-green-500">
                            <TrendingUp className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">Monthly Revenue</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-white">
                                {isLoading ? "..." : `$${stats.monthlyRevenue}`}
                            </h3>
                            <span className="text-gray-400 text-sm">Estimated</span>
                        </div>
                        <p className="text-green-400/60 text-xs mt-1 font-mono">Based on active members * $50</p>
                    </div>
                </div>

                {/* Completion Rate Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-light border border-white/5 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-purple-500/50">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-purple-500">
                            <Activity className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">Completion Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-white">
                                {isLoading ? "..." : `${stats.completionRate}%`}
                            </h3>
                            <span className="text-gray-400 text-sm">All Time</span>
                        </div>
                        {/* Simple progress bar */}
                        <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-purple-500 h-full transition-all duration-1000"
                                style={{ width: `${stats.completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Workout CTA & Table */}
            <div className="grid grid-cols-1 gap-8">
                <ClientsTable />
            </div>
        </div>
    );
};

export default DashboardHome;
