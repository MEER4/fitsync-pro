import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    ArrowLeft, Dumbbell, Utensils, Calendar, Mail,
    CheckCircle2, Clock, TrendingUp, UserPlus
} from 'lucide-react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { AssignRoutineModal } from '../../components/coach/AssignRoutineModal';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

interface MemberProfile {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    role: string;
    created_at?: string;
}

interface MemberAssignment {
    id: string;
    status: string;
    scheduled_date: string;
    completed_at?: string;
    routine: {
        id: string;
        name: string;
    };
}

const MemberProfilePage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [member, setMember] = useState<MemberProfile | null>(null);
    const [assignments, setAssignments] = useState<MemberAssignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        if (!memberId) return;
        const fetchData = async () => {
            try {
                const [memberRes, assignmentsRes] = await Promise.all([
                    api.get(`/users/members/${memberId}`),
                    api.get(`/assignments/member/${memberId}`)
                ]);
                setMember(memberRes.data);
                setAssignments(assignmentsRes.data);
            } catch (error) {
                console.error('Failed to load member:', error);
                showToast(t('memberProfile.loadError'), 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [memberId]);

    if (isLoading) {
        return (
            <div className="animate-fade-in space-y-6">
                <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
                <div className="h-40 bg-white/5 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="text-center py-20 text-text-muted">
                {t('memberProfile.notFound')}
                <br />
                <Button variant="outline" onClick={() => navigate('/dashboard/members')} className="mt-4">
                    {t('memberProfile.back')}
                </Button>
            </div>
        );
    }

    const completed = assignments.filter(a => a.status === 'completed');
    const pending = assignments.filter(a => a.status !== 'completed');

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/members')}
                className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-sm"
            >
                <ArrowLeft size={16} />
                {t('memberProfile.back')}
            </button>

            {/* Profile Header */}
            <Card className="p-6 md:p-8 bg-surface-dark border-border/10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shrink-0 overflow-hidden border-2 border-border/10">
                        {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                        ) : (
                            member.full_name?.[0] || member.email[0]
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-display font-bold text-text-main truncate">
                            {member.full_name || t('memberProfile.unnamed')}
                        </h1>
                        <div className="flex items-center gap-2 text-text-muted mt-1">
                            <Mail size={14} />
                            <span className="text-sm">{member.email}</span>
                        </div>
                        {member.created_at && (
                            <div className="flex items-center gap-2 text-text-muted mt-1">
                                <Calendar size={14} />
                                <span className="text-xs">{t('memberProfile.joined', { date: format(new Date(member.created_at), 'MMM dd, yyyy') })}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="gap-2 flex-1 md:flex-none" onClick={() => setIsAssignModalOpen(true)}>
                            <Dumbbell size={16} /> {t('memberProfile.assignRoutine')}
                        </Button>
                        <Button variant="outline" className="gap-2 flex-1 md:flex-none" onClick={() => navigate(`/dashboard/members/${memberId}/diet`)}>
                            <Utensils size={16} /> {t('memberProfile.diet')}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-surface-dark border-border/10 text-center">
                    <TrendingUp className="text-green-500 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-text-main">{completed.length}</p>
                    <p className="text-xs text-text-muted">{t('memberProfile.completed')}</p>
                </Card>
                <Card className="p-4 bg-surface-dark border-border/10 text-center">
                    <Clock className="text-yellow-500 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-text-main">{pending.length}</p>
                    <p className="text-xs text-text-muted">{t('memberProfile.pending')}</p>
                </Card>
                <Card className="p-4 bg-surface-dark border-border/10 text-center">
                    <Dumbbell className="text-blue-500 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-text-main">{assignments.length}</p>
                    <p className="text-xs text-text-muted">{t('memberProfile.totalAssigned')}</p>
                </Card>
                <Card className="p-4 bg-surface-dark border-border/10 text-center">
                    <CheckCircle2 className="text-primary mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-text-main">
                        {assignments.length > 0 ? Math.round((completed.length / assignments.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-text-muted">{t('memberProfile.completionRate')}</p>
                </Card>
            </div>

            {/* Pending Assignments */}
            {pending.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-yellow-500" />
                        {t('memberProfile.pendingWorkouts')}
                    </h2>
                    <div className="space-y-3">
                        {pending.map(assignment => (
                            <Card key={assignment.id} className="p-4 bg-surface-dark border-border/10 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="text-center bg-background-dark p-2 rounded min-w-[50px] border border-border/10">
                                        <div className="text-xs text-primary font-bold">{format(new Date(assignment.scheduled_date), 'MMM')}</div>
                                        <div className="text-lg font-bold text-text-main">{format(new Date(assignment.scheduled_date), 'dd')}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main">{assignment.routine.name}</h4>
                                        <p className="text-xs text-text-muted capitalize">{assignment.status}</p>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed History */}
            {completed.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        {t('memberProfile.completedHistory')}
                    </h2>
                    <div className="space-y-3">
                        {completed.slice(0, 10).map(assignment => (
                            <Card key={assignment.id} className="p-4 bg-surface-dark border-border/10 flex justify-between items-center opacity-80">
                                <div className="flex items-center gap-4">
                                    <div className="text-center bg-green-500/10 p-2 rounded min-w-[50px] border border-green-500/20">
                                        <div className="text-xs text-green-600 dark:text-green-400 font-bold">
                                            {assignment.completed_at ? format(new Date(assignment.completed_at), 'MMM') : '—'}
                                        </div>
                                        <div className="text-lg font-bold text-text-main">
                                            {assignment.completed_at ? format(new Date(assignment.completed_at), 'dd') : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main">{assignment.routine.name}</h4>
                                        <p className="text-xs text-green-600 dark:text-green-400">{t('memberProfile.completed')}</p>
                                    </div>
                                </div>
                                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {assignments.length === 0 && (
                <div className="text-center py-16 text-text-muted space-y-4">
                    <p>{t('memberProfile.noAssignments')}</p>
                    <Button variant="outline" className="gap-2" onClick={() => setIsAssignModalOpen(true)}>
                        <UserPlus size={16} /> {t('memberProfile.assignFirst')}
                    </Button>
                </div>
            )}

            {/* Assign Routine Modal */}
            {member && (
                <AssignRoutineModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    memberId={member.id}
                    memberName={member.full_name || member.email}
                    onSuccess={() => {
                        showToast(t('memberProfile.routineAssigned'), 'success');
                        // Refresh assignments
                        api.get(`/assignments/member/${memberId}`).then(res => setAssignments(res.data));
                    }}
                />
            )}
        </div>
    );
};

export default MemberProfilePage;
