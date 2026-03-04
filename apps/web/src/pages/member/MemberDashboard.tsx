import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Activity, Play, TrendingUp, Utensils } from 'lucide-react';
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
    const { t } = useTranslation();
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
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">
                    {t('memberDashboard.welcome')}, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                </h1>
                <p className="text-text-muted">{t('memberDashboard.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Workout Card */}
                <Card
                    className="col-span-1 md:col-span-3 lg:col-span-2 p-0 bg-surface-dark border-border/10 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all shadow-2xl"
                    onClick={() => nextWorkout && navigate(`/workout/${nextWorkout.routine.id}?assignmentId=${nextWorkout.id}`)}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark/90 via-background-dark/40 to-transparent" />

                    <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full min-h-[220px]">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-primary">
                                <Activity className="animate-pulse" size={20} />
                                <span className="text-sm font-bold tracking-wider uppercase">{t('memberDashboard.activeSession')}</span>
                            </div>

                            {isLoading ? (
                                <div className="text-2xl text-text-muted animate-pulse">{t('memberDashboard.loading')}</div>
                            ) : nextWorkout ? (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-text-main mb-2 leading-tight">
                                        {nextWorkout.routine.name}
                                    </h2>
                                    <p className="text-text-muted max-w-md text-lg">
                                        {t('memberDashboard.readySession', { min: nextWorkout.routine.estimated_duration_min })}
                                        <br />
                                        <span className="text-sm text-text-muted mt-1 block opacity-70">{t('memberDashboard.coach')}: {nextWorkout.coach?.full_name}</span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-display font-bold text-text-main mb-2">{t('memberDashboard.restDay')}</h2>
                                    <p className="text-text-muted">{t('memberDashboard.noWorkouts')}</p>
                                </>
                            )}
                        </div>

                        {nextWorkout && (
                            <div className="mt-6">
                                <Button size="lg" variant="primary" className="shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                                    <Play size={20} className="mr-2 fill-current" /> {t('memberDashboard.launchSession')}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Progress Card */}
                <Card className="col-span-1 p-0 bg-surface-dark border-border/10 relative overflow-hidden group cursor-pointer hover:border-green-500/50 transition-all min-h-[220px] shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-background-dark/40 to-transparent" />

                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-green-500">
                                <TrendingUp className="animate-pulse" size={20} />
                                <span className="text-xs font-bold tracking-wider uppercase">{t('memberDashboard.weeklyGoals')}</span>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-text-main mb-1">{t('memberDashboard.progress')}</h3>

                            {stats ? (
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-bold text-text-main">{stats.completedWorkouts}</span>
                                        <span className="text-text-muted mb-1">{t('memberDashboard.workoutsProgress', { goal: stats.weeklyGoal })}</span>
                                    </div>
                                    <div className="w-full bg-background-dark/20 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-pulse space-y-3 mt-2">
                                    <div className="h-8 bg-text-main/10 rounded w-1/2"></div>
                                    <div className="h-1.5 bg-text-main/10 rounded w-full"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Nutrition Card */}
                <Card
                    className="col-span-1 md:col-span-3 p-0 bg-surface-dark border-border/10 relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition-all min-h-[220px] shadow-xl"
                    onClick={() => navigate('/dashboard/nutrition')}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-background-dark/40 to-transparent" />

                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-orange-500">
                                <Utensils className="animate-pulse" size={20} />
                                <span className="text-xs font-bold tracking-wider uppercase">{t('memberDashboard.nutritionPlan')}</span>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-text-main mb-2">{t('memberDashboard.fuelBody')}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">
                                {t('memberDashboard.nutritionDesc')}
                            </p>
                        </div>

                        <div className="flex justify-end mt-4">
                            <span className="text-orange-500 text-sm font-bold group-hover:translate-x-1 transition-transform">{t('memberDashboard.viewPlan')}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Assignments List */}
            {assignments.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-text-main mb-4">{t('memberDashboard.upcomingWorkouts')}</h2>
                    <div className="space-y-3">
                        {assignments.map(assignment => (
                            <div
                                key={assignment.id}
                                className="p-4 bg-surface-dark border border-border rounded-lg flex justify-between items-center hover:bg-text-main/5 transition-colors cursor-pointer"
                                onClick={() => navigate(`/workout/${assignment.routine.id}?assignmentId=${assignment.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-center bg-text-main/5 p-2 rounded min-w-[60px]">
                                        <div className="text-xs text-primary font-bold">{format(new Date(assignment.scheduled_date), 'MMM')}</div>
                                        <div className="text-lg font-bold text-text-main">{format(new Date(assignment.scheduled_date), 'dd')}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main">{assignment.routine.name}</h4>
                                        <p className="text-xs text-text-muted">{t('memberDashboard.workoutInfo', { min: assignment.routine.estimated_duration_min, difficulty: t(`difficulty.${assignment.routine.difficulty_level}`) })}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-sm">{t('memberDashboard.start')}</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDashboard;
