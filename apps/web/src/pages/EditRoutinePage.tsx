import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoutineForm } from '../components/routines/RoutineForm';
import api from '../lib/api';
import { useTranslation } from 'react-i18next';

const EditRoutinePage = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            if (!routineId) return;
            try {
                const res = await api.get(`/routines/${routineId}`);
                const routine = res.data;
                setInitialData({
                    name: routine.name,
                    items: routine.items.map((item: any) => ({
                        exercise_id: item.exercise_id,
                        name: item.exercise?.title || 'Unknown Exercise',
                        sets: item.sets,
                        reps: item.reps,
                        rest_seconds: item.rest_seconds || 60,
                    }))
                });
            } catch (error) {
                console.error('Failed to load routine:', error);
                navigate('/dashboard/routines/new');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoutine();
    }, [routineId, navigate]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="text-center py-20 text-text-muted">{t('routines.edit.loading')}</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('routines.edit.title')}</h1>
                <p className="text-text-muted">{t('routines.edit.subtitle')}</p>
            </div>
            {initialData && <RoutineForm routineId={routineId} initialData={initialData} />}
        </div>
    );
};

export default EditRoutinePage;
