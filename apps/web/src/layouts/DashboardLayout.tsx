import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background-dark text-text-main overflow-hidden font-body relative transition-colors duration-300">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-auto bg-background-dark relative flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden p-4 flex items-center border-b border-border/10 bg-surface-dark sticky top-0 z-30 transition-colors duration-300">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-text-muted hover:text-text-main transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 text-lg font-bold font-display text-text-main">FitSync</span>
                </div>

                {/* Ambient background effect - lowered opacity for light mode if needed */}
                <div className="absolute inset-0 bg-nebula-gradient pointer-events-none opacity-[0.4] dark:opacity-50" />

                <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
