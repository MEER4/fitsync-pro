import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
    parseISO
} from 'date-fns';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface Assignment {
    id: string;
    routine_id: string;
    status: string;
    scheduled_date: string;
    routine: {
        name: string;
        estimated_duration_min: number;
    };
}

const MemberCalendarPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, [currentDate]);

    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/assignments/my-assignments');
            setAssignments(res.data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-main font-display capitalize">
                {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handlePreviousMonth} className="px-3 border-border/10 hover:bg-surface-light/50 text-text-muted transition-all">
                    <ChevronLeft size={20} />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="px-4 border-border/10 hover:bg-surface-light/50 text-text-muted transition-all">
                    {t('calendar.today')}
                </Button>
                <Button variant="outline" onClick={handleNextMonth} className="px-3 border-border/10 hover:bg-surface-light/50 text-text-muted transition-all">
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );

    const renderDays = () => {
        const dateFormat = 'EEEE';
        const days = [];
        let startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center font-bold text-sm text-text-muted py-2 uppercase tracking-wider">
                    {format(addDays(startDate, i), dateFormat).substring(0, 3)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayAssignments = assignments.filter(a =>
                    format(parseISO(a.scheduled_date), 'yyyy-MM-dd') === dateKey
                );

                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "min-h-[120px] p-2 border border-border/10 transition-all",
                            !isCurrentMonth ? 'opacity-30' : 'bg-surface-dark text-text-main hover:bg-surface-light/30',
                            isToday && 'border-primary/50 bg-primary/5'
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                                "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                isToday ? 'bg-primary text-background-dark shadow-sm' : 'text-text-muted'
                            )}>
                                {formattedDate}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {dayAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    onClick={() => navigate(`/workout/${assignment.routine_id}?assignmentId=${assignment.id}`)}
                                    className={`p-2 rounded text-xs cursor-pointer border-l-2 truncate transition-transform hover:scale-[1.02]
                                        ${assignment.status === 'completed'
                                            ? 'bg-green-500/10 border-green-500 text-green-400'
                                            : 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                                        }`}
                                >
                                    <div className="font-bold truncate">{assignment.routine.name}</div>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                                        {assignment.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                        {assignment.routine.estimated_duration_min} min
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7" >
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className="animate-fade-in pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('calendar.title')}</h1>
                <p className="text-text-muted">{t('calendar.subtitle')}</p>
            </div>

            <Card className="p-6 bg-surface-dark border-border/10 shadow-sm overflow-hidden">
                {renderHeader()}

                {isLoading && assignments.length === 0 ? (
                    <div className="h-[600px] flex items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center text-text-muted">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="font-medium tracking-widest text-sm uppercase">{t('calendar.loading')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl overflow-hidden border border-border/10">
                        {renderDays()}
                        {renderCells()}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MemberCalendarPage;
