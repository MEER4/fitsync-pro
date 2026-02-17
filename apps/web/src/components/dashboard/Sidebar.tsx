import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
    const links = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
        { to: "/dashboard/athletes", icon: Users, label: "Athletes" },
        { to: "/dashboard/workouts", icon: Activity, label: "Workouts" },
        { to: "/dashboard/exercises", icon: Dumbbell, label: "Exercises" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];

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
                <button className="flex w-full items-center gap-3 px-4 py-3 text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
