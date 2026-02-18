import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
    const { profile, isLoading, signOut } = useAuth();

    const coachLinks = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
        { to: "/dashboard/athletes", icon: Users, label: "Athletes" },
        { to: "/dashboard/routines/new", icon: Activity, label: "Create Workout" },
        { to: "/dashboard/exercises", icon: Dumbbell, label: "Exercises" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];

    const memberLinks = [
        { to: "/dashboard/member", icon: LayoutDashboard, label: "My Dashboard", end: true },
        { to: "/dashboard/history", icon: Activity, label: "History" }, // Placeholder
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];

    if (isLoading) {
        return (
            <aside className="w-64 bg-surface-dark border-r border-white/5 flex flex-col h-full p-6">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-white/10 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-white/10 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-white/10 rounded col-span-2"></div>
                                <div className="h-2 bg-white/10 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-white/10 rounded"></div>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }

    // Default to member links if role is missing or not 'coach', to be safe.
    // Ideally, if no role, maybe show nothing or generic links.
    const links = profile?.role === 'coach' ? coachLinks : memberLinks;

    return (
        <aside className="w-64 bg-surface-dark border-r border-white/5 flex flex-col h-full">
            <div className="p-6 border-b border-white/5 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Activity className="text-background-dark" size={20} />
                </div>
                <h1 className="text-2xl font-display font-bold text-white tracking-wide">
                    FitSync <span className="text-primary">.</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            isActive
                                ? "bg-white/5 text-primary shadow-[inset_4px_0_0_0_#d4af37]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 px-4 py-3 text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
