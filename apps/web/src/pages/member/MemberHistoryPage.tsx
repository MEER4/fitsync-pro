import { useState, useMemo } from 'react';
import { useAssignments } from '../../hooks/useAssignments';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, Trophy, MessageSquare, Search, Activity } from 'lucide-react';
import { format, isThisWeek, isThisMonth } from 'date-fns';
import { useTranslation } from 'react-i18next';

const MemberHistoryPage = () => {
    const { t } = useTranslation();
    const { assignments, isLoading } = useAssignments();

    // Filter out uncompleted assignments
    const completedAssignments = useMemo(() => {
        return assignments.filter(a => a.status === 'completed');
    }, [assignments]);

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');

    // Stats
    const stats = useMemo(() => {
        return {
            total: completedAssignments.length,
            thisMonth: completedAssignments.filter(a => a.completed_date && isThisMonth(new Date(a.completed_date))).length,
            totalExercises: completedAssignments.reduce((acc, a) => acc + (a.routine?.items?.length || 0), 0)
        };
    }, [completedAssignments]);

    // Apply Filters
    const filteredAssignments = useMemo(() => {
        return completedAssignments.filter(a => {
            const matchesSearch = a.routine?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesDate = true;

            if (dateFilter === 'this_week') {
                matchesDate = a.completed_date ? isThisWeek(new Date(a.completed_date)) : false;
            } else if (dateFilter === 'this_month') {
                matchesDate = a.completed_date ? isThisMonth(new Date(a.completed_date)) : false;
            }

            return matchesSearch && matchesDate;
        });
    }, [completedAssignments, searchTerm, dateFilter]);

    if (isLoading) return <div className="p-8 text-center text-gray-400">{t('common.loading') || 'Loading history...'}</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('history.title')}</h1>
                <p className="text-text-muted">{t('history.subtitle')}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-surface-dark border-border/10 shadow-md flex flex-col items-center justify-center text-center">
                    <span className="text-text-muted text-sm mb-1">{t('history.statsTotalCompleted')}</span>
                    <span className="text-2xl font-bold text-text-main flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-400" />
                        {stats.total}
                    </span>
                </Card>
                <Card className="p-4 bg-surface-dark border-border/10 shadow-md flex flex-col items-center justify-center text-center">
                    <span className="text-text-muted text-sm mb-1">{t('history.statsThisMonth')}</span>
                    <span className="text-2xl font-bold text-text-main flex items-center gap-2">
                        <Calendar size={20} className="text-primary" />
                        {stats.thisMonth}
                    </span>
                </Card>
                <Card className="p-4 bg-surface-dark border-border/10 shadow-md flex flex-col items-center justify-center text-center">
                    <span className="text-text-muted text-sm mb-1">{t('history.statsTotalExercises')}</span>
                    <span className="text-2xl font-bold text-text-main flex items-center gap-2">
                        <Activity size={20} className="text-green-400" />
                        {stats.totalExercises}
                    </span>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder={t('history.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-dark border border-border/10 text-text-main focus:border-primary transition-colors"
                    />
                </div>
                <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-surface-dark border border-border/10 text-text-main focus:border-primary transition-colors cursor-pointer"
                >
                    <option value="all">{t('history.filterAll')}</option>
                    <option value="this_month">{t('history.filterThisMonth')}</option>
                    <option value="this_week">{t('history.filterThisWeek')}</option>
                </select>
            </div>

            <div className="grid gap-4">
                {filteredAssignments.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-border/10 bg-transparent">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-text-main/5 mb-6">
                            <Trophy className="text-text-muted" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">{t('history.noCompletedWorkouts')}</h3>
                        <p className="text-text-muted">{t('history.completeFirstAssigned')}</p>
                    </Card>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <Card key={assignment.id} className="p-6 bg-surface-dark border-border/10 shadow-md hover:border-primary/20 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-text-main">{assignment.routine.name}</h3>
                                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                                            {t('history.completed')}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {assignment.completed_date && format(new Date(assignment.completed_date), 'PPP @ p')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {t('history.estimatedDuration', { min: assignment.routine.estimated_duration_min })}
                                        </span>
                                    </div>
                                    {assignment.feedback_notes && (
                                        <div className="mt-4 p-3 bg-text-main/5 rounded-lg text-sm text-text-main/80 flex items-start gap-2">
                                            <MessageSquare size={14} className="mt-0.5 text-primary shrink-0" />
                                            <p>"{assignment.feedback_notes}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Future: Show calculated stats or specific achievements here */}
                                <div className="text-right hidden md:block">
                                    <div className="text-2xl font-bold text-primary">
                                        {assignment.routine.items.length}
                                    </div>
                                    <div className="text-xs text-text-muted uppercase tracking-wider">{t('history.exercises')}</div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberHistoryPage;
