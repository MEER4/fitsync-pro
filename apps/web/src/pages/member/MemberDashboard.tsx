import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Dumbbell, Calendar, TrendingUp } from 'lucide-react';

const MemberDashboard = () => {
    const { profile } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                </h1>
                <p className="text-gray-400">Ready to crush your goals today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-surface-light border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-background-dark transition-colors">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Today's Workout</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Leg Day - Hypertrophy</p>
                    <div className="mt-4 text-xs font-mono text-primary">Scheduled for 18:00</div>
                </Card>

                <Card className="p-6 bg-surface-light border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-background-dark transition-colors">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Weekly Progress</h3>
                    </div>
                    <p className="text-gray-400 text-sm">3/4 Workouts Completed</p>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-green-500 h-full w-[75%]"></div>
                    </div>
                </Card>

                <Card className="p-6 bg-surface-light border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-background-dark transition-colors">
                            <Dumbbell size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Active Program</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Summer Shred 2026</p>
                    <div className="mt-4 text-xs font-mono text-purple-400">Week 4 of 12</div>
                </Card>
            </div>

            <div className="p-8 border border-white/10 rounded-2xl bg-surface-dark/50 text-center">
                <p className="text-gray-400">More member features coming soon...</p>
            </div>
        </div>
    );
};

export default MemberDashboard;
