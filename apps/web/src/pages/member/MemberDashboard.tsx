import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dumbbell, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/assignments/my-assignments');
            // Filter out completed assignments for the dashboard view
            const activeAssignments = res.data.filter((a: Assignment) => a.status !== 'completed');
            setAssignments(activeAssignments);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
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
                    className="p-6 bg-surface-light border-white/5 hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
                    onClick={() => nextWorkout && navigate(`/workout/${nextWorkout.routine.id}?assignmentId=${nextWorkout.id}`)}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Dumbbell size={100} />
                    </div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-background-dark transition-colors">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Next Workout</h3>
                    </div>

                    {isLoading ? (
                        <div className="text-sm text-gray-400 animate-pulse">Loading schedule...</div>
                    ) : nextWorkout ? (
                        <div className="relative z-10">
                            <p className="text-xl font-bold text-white">{nextWorkout.routine.name}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xs font-mono text-primary">
                                    {format(new Date(nextWorkout.scheduled_date), 'MMM dd, HH:mm')}
                                </div>
                                <span className="p-1 rounded-full bg-white/10 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                    <ChevronRight size={16} />
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Coach: {nextWorkout.coach?.full_name}</p>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm">No active assignments.</p>
                            <p className="text-xs text-gray-500 mt-2">Wait for your coach to assign a routine.</p>
                        </div>
                    )}
                </Card>

                {/* Progress Card (Placeholder) */}
                <Card className="p-6 bg-surface-light border-white/5 hover:border-green-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-background-dark transition-colors">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Weekly Progress</h3>
                    </div>
                    <p className="text-gray-400 text-sm">0/4 Workouts Completed</p>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-green-500 h-full w-[0%]"></div>
                    </div>
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
