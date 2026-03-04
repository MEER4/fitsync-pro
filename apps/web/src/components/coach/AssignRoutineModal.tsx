import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Dumbbell, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import api from '../../lib/api';
import { format } from 'date-fns';
import { useToast } from '../../context/ToastContext';

interface AssignRoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
    memberId: string;
    memberName: string;
    onSuccess: () => void;
}

interface Routine {
    id: string;
    name: string;
    difficulty_level: string;
    estimated_duration_min: number;
}

export const AssignRoutineModal = ({ isOpen, onClose, memberId, memberName, onSuccess }: AssignRoutineModalProps) => {
    const { t } = useTranslation();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
    const [scheduledDate, setScheduledDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchRoutines();
        }
    }, [isOpen]);

    const fetchRoutines = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/routines');
            setRoutines(response.data);
        } catch (error) {
            console.error('Failed to fetch routines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedRoutineId) return;

        try {
            setIsSubmitting(true);
            await api.post('/assignments', {
                memberId,
                routineId: selectedRoutineId,
                scheduledDate: new Date(scheduledDate).toISOString(),
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to assign routine:', error);
            showToast(t('assignModal.error'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const filteredRoutines = routines.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-2xl bg-surface-dark border-border shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-surface-dark sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-text-main">{t('assignModal.title')}</h2>
                        <p className="text-text-muted">{t('assignModal.assigningTo')} <span className="text-primary font-bold">{memberName}</span></p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    {/* Date Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            {t('assignModal.scheduledDate')}
                        </label>
                        <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full bg-background-dark border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    {/* Routine Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-main flex items-center gap-2">
                                <Dumbbell size={16} className="text-primary" />
                                {t('assignModal.selectRoutine')}
                            </label>
                            <div className="relative w-1/2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                <input
                                    type="text"
                                    placeholder={t('assignModal.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-background-dark border border-border rounded-full pl-9 pr-3 py-1 text-sm text-text-main focus:outline-none focus:border-primary/50 placeholder:text-text-muted"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {isLoading ? (
                                <div className="text-center py-8 text-text-muted">{t('assignModal.loading')}</div>
                            ) : filteredRoutines.length === 0 ? (
                                <div className="text-center py-8 text-text-muted">{t('assignModal.noRoutinesFound')}</div>
                            ) : (
                                filteredRoutines.map(routine => (
                                    <div
                                        key={routine.id}
                                        onClick={() => setSelectedRoutineId(routine.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center group
                                            ${selectedRoutineId === routine.id
                                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                                : 'bg-text-main/5 border-border hover:bg-text-main/10 hover:border-text-main/20'
                                            }`}
                                    >
                                        <div>
                                            <h4 className={`font-bold ${selectedRoutineId === routine.id ? 'text-primary' : 'text-text-main'}`}>
                                                {routine.name}
                                            </h4>
                                            <div className="flex gap-3 text-xs text-text-muted mt-1">
                                                <span>{routine.difficulty_level}</span>
                                                <span>•</span>
                                                <span>{routine.estimated_duration_min} min</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                            ${selectedRoutineId === routine.id
                                                ? 'border-primary bg-primary text-background-dark'
                                                : 'border-text-muted'
                                            }`}>
                                            {selectedRoutineId === routine.id && <div className="w-2.5 h-2.5 bg-background-dark rounded-full" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-surface-dark flex gap-3 justify-end sticky bottom-0 z-10">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        {t('assignModal.cancel')}
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedRoutineId || isSubmitting}
                        className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    >
                        {isSubmitting ? t('assignModal.assigning') : t('assignModal.confirmAssignment')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};
