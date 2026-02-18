import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dumbbell, TrendingUp, Activity, Play } from 'lucide-react';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Assignment {
    id: string;
    status: string;
    scheduled_date: string;
    routine: {
        id: string;
        name: string;
        difficulty_level: string;
        estimated_duration_min: number;
    };
    coach: {
        full_name: string;
    };
}

const MemberDashboard = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [stats, setStats] = useState<{ completedWorkouts: number; weeklyGoal: number; percentage: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, statsRes] = await Promise.all([
                api.get('/assignments/my-assignments'),
                api.get('/dashboard/member-stats')
            ]);

            // Filter out completed assignments for the dashboard view
            const activeAssignments = assignmentsRes.data.filter((a: Assignment) => a.status !== 'completed');
            setAssignments(activeAssignments);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextWorkout = assignments[0]; // Assuming backend sorts by date asc

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                </h1>
                <p className="text-gray-400">Ready to crush your goals today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Workout Card */}
                <Card
                    className="col-span-1 md:col-span-3 lg:col-span-2 p-0 bg-gradient-to-br from-surface-light to-black border-primary/20 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => nextWorkout && navigate(`/workout/${nextWorkout.routine.id}?assignmentId=${nextWorkout.id}`)}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

                    <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full min-h-[220px]">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-primary">
                                <Activity className="animate-pulse" size={20} />
                                <span className="text-sm font-bold tracking-wider uppercase">Active Session</span>
                            </div>

                            {isLoading ? (
                                <div className="text-2xl text-gray-400 animate-pulse">Loading schedule...</div>
                            ) : nextWorkout ? (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
                                        {nextWorkout.routine.name}
                                    </h2>
                                    <p className="text-gray-300 max-w-md text-lg">
                                        Ready to crush your {nextWorkout.routine.estimated_duration_min} min session?
                                        <br />
                                        <span className="text-sm text-gray-500 mt-1 block">Coach: {nextWorkout.coach?.full_name}</span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-display font-bold text-white mb-2">Rest Day</h2>
                                    <p className="text-gray-400">No workouts scheduled for today. Enjoy your recovery.</p>
                                </>
                            )}
                        </div>

                        {nextWorkout && (
                            <div className="mt-6">
                                <Button size="lg" variant="primary" className="shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                                    <Play size={20} className="mr-2 fill-current" /> Launch Session
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Progress Card */}
                <Card className="p-6 bg-surface-light border-white/5 hover:border-green-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-background-dark transition-colors">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Weekly Progress</h3>
                    </div>
                    {stats ? (
                        <>
                            <p className="text-gray-400 text-sm">{stats.completedWorkouts}/{stats.weeklyGoal} Workouts Completed</p>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div
                                    className="bg-green-500 h-full transition-all duration-1000 ease-out"
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            <div className="h-1.5 bg-white/10 rounded w-full"></div>
                        </div>
                    )}
                </Card>

                {/* Active Program Card (Placeholder) */}
                <Card className="p-6 bg-surface-light border-white/5 hover:border-purple-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-background-dark transition-colors">
                            <Dumbbell size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Active Program</h3>
                    </div>
                    <p className="text-gray-400 text-sm">General Fitness</p>
                    <div className="mt-4 text-xs font-mono text-purple-400">Week 1</div>
                </Card>
            </div>

            {/* Assignments List */}
            {assignments.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Upcoming Workouts</h2>
                    <div className="space-y-3">
                        {assignments.map(assignment => (
                            <div
                                key={assignment.id}
                                className="p-4 bg-surface-dark border border-white/5 rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => navigate(`/workout/${assignment.routine.id}?assignmentId=${assignment.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-center bg-white/5 p-2 rounded min-w-[60px]">
                                        <div className="text-xs text-primary font-bold">{format(new Date(assignment.scheduled_date), 'MMM')}</div>
                                        <div className="text-lg font-bold text-white">{format(new Date(assignment.scheduled_date), 'dd')}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{assignment.routine.name}</h4>
                                        <p className="text-xs text-gray-400">{assignment.routine.estimated_duration_min} min • {assignment.routine.difficulty_level}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-sm">Start</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDashboard;
