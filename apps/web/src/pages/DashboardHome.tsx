import { StatCard } from '../components/dashboard/StatCard';
import { ClientsTable } from '../components/dashboard/ClientsTable';
import { Users, DollarSign, Activity } from 'lucide-react';

const DashboardHome = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome back, Coach</h2>
                <p className="text-gray-400">Here's what's happening in your studio today.</p>
            </div>

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
                    icon={DollarSign}
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

            <div>
                <ClientsTable />
            </div>
        </div>
    );
};

export default DashboardHome;
