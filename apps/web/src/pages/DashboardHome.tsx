// import { StatCard } from '../components/dashboard/StatCard'; // Removed as we use custom styled cards now
import { ClientsTable } from '../components/dashboard/ClientsTable';
import { Users, Activity, TrendingUp, Dumbbell, ClipboardList } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
    const { t } = useTranslation();
    const { profile } = useAuth();
    const [stats, setStats] = useState({
        activeAthletes: 0,
        completionRate: 0,
        monthlyRevenue: 0,
        activeRoutines: 0,
        pendingAssignments: 0
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
                <h2 className="text-3xl font-display font-bold text-text-main mb-2">{t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || 'Coach'}</h2>
                <p className="text-text-muted">{t('dashboard.subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Athletes Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-border/10 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-primary/50 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-background-dark/90 via-background-dark/60 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-primary">
                            <Users className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.activeMembers')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-text-main">
                                {isLoading ? "..." : stats.activeAthletes}
                            </h3>
                            <span className="text-text-muted text-sm">{t('dashboard.totalMembers')}</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-border/10 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-green-500/50 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-background-dark/90 via-background-dark/60 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-green-500">
                            <TrendingUp className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.monthlyRevenue')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-text-main">
                                {isLoading ? "..." : `$${stats.monthlyRevenue}`}
                            </h3>
                            <span className="text-text-muted text-sm">{t('dashboard.estimated')}</span>
                        </div>
                        <p className="text-green-500/80 text-xs mt-1 font-mono">{t('dashboard.basedOn')}</p>
                    </div>
                </div>

                {/* Completion Rate Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-border/10 min-h-[160px] p-6 flex flex-col justify-between transition-all hover:border-purple-500/50 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-background-dark/90 via-background-dark/60 to-transparent" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-purple-500">
                            <Activity className="animate-pulse" size={24} />
                            <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.completionRate')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-display font-bold text-text-main">
                                {isLoading ? "..." : `${stats.completionRate}%`}
                            </h3>
                            <span className="text-text-muted text-sm">{t('dashboard.allTime')}</span>
                        </div>
                        {/* Simple progress bar */}
                        <div className="w-full bg-text-main/10 h-1 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-purple-500 h-full transition-all duration-1000"
                                style={{ width: `${stats.completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Routines Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-border/10 p-6 transition-all hover:border-blue-500/50 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-blue-500">
                                <Dumbbell size={22} />
                                <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.activeRoutines')}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-display font-bold text-text-main">
                                    {isLoading ? "..." : stats.activeRoutines}
                                </h3>
                                <span className="text-text-muted text-sm">{t('dashboard.created')}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-500/10 rounded-xl">
                            <Dumbbell size={32} className="text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Pending Assignments Card */}
                <div className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-border/10 p-6 transition-all hover:border-orange-500/50 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-orange-500">
                                <ClipboardList size={22} />
                                <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.pendingAssignments')}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-display font-bold text-text-main">
                                    {isLoading ? "..." : stats.pendingAssignments}
                                </h3>
                                <span className="text-text-muted text-sm">{t('dashboard.awaiting')}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-500/10 rounded-xl">
                            <ClipboardList size={32} className="text-orange-500" />
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
