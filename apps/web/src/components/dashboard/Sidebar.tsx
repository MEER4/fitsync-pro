import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Dumbbell, X, Utensils, UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { profile, isLoading, signOut } = useAuth();
    const { t } = useTranslation();

    const coachLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
        { to: "/dashboard/members", icon: Users, label: t('nav.members') },
        { to: "/dashboard/leads", icon: UserPlus, label: t('nav.leads') },
        { to: "/dashboard/routines", icon: Activity, label: t('nav.workouts') },
        { to: "/dashboard/exercises", icon: Dumbbell, label: t('nav.exercises') },
        { to: "/dashboard/settings", icon: Settings, label: t('nav.settings') },
    ];

    const memberLinks = [
        { to: "/dashboard/member", icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
        { to: "/dashboard/calendar", icon: Activity, label: t('nav.calendar') },
        { to: "/dashboard/nutrition", icon: Utensils, label: t('nav.nutrition') },
        { to: "/dashboard/history", icon: Activity, label: t('nav.history') },
        { to: "/dashboard/settings", icon: Settings, label: t('nav.settings') },
    ];

    if (isLoading) {
        return (
            <aside className="w-64 bg-surface-dark border-r border-border/10 flex flex-col h-full p-6">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-text-main/10 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-text-main/10 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-text-main/10 rounded col-span-2"></div>
                                <div className="h-2 bg-text-main/10 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-text-main/10 rounded"></div>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }

    // Default to member links if role is missing or not 'coach', to be safe.
    // Ideally, if no role, maybe show nothing or generic links.
    // Default to member links if role is missing or not 'coach', to be safe.
    // Ideally, if no role, maybe show nothing or generic links.
    const links = profile?.role === 'coach' ? coachLinks : memberLinks;

    return (
        <aside
            className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-surface-dark border-r border-border/10 flex flex-col h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="p-6 border-b border-border/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Activity className="text-background-dark" size={20} />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-text-main tracking-wide">
                        FitSync <span className="text-primary">.</span>
                    </h1>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden text-text-muted hover:text-text-main"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={() => {
                            // Close sidebar on mobile when a link is clicked
                            if (window.innerWidth < 768) {
                                onClose();
                            }
                        }}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "bg-text-main/5 text-primary shadow-[inset_4px_0_0_0_#d4af37]"
                                : "text-text-muted hover:text-text-main hover:bg-text-main/5"
                        )}
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border/10">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 px-4 py-3 text-secondary hover:text-text-main hover:bg-text-main/5 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span>{t('nav.signOut')}</span>
                </button>
            </div>
        </aside>
    );
};
