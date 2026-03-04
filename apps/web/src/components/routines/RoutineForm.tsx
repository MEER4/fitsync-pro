import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Save, Trash2, Dumbbell, Loader2 } from 'lucide-react';
import { useExercises } from '../../hooks/useExercises';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- REMOVED MOCK DATA ---

type RoutineItem = {
    exercise_id: string;
    name: string; // Helper for display
    sets: number;
    reps: string;
    rest_seconds: number;
};

type RoutineFormValues = {
    name: string;
    items: RoutineItem[];
};

import { useRoutineDraft } from '../../hooks/useRoutineDraft';

interface RoutineFormProps {
    routineId?: string;
    initialData?: RoutineFormValues;
}

export const RoutineForm = ({ routineId, initialData }: RoutineFormProps) => {
    const navigate = useNavigate();
    const { exercises, loading, error: exercisesError } = useExercises();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

    const form = useForm<RoutineFormValues>({
        defaultValues: initialData || {
            name: '',
            items: []
        }
    });

    const { register, control, handleSubmit, formState: { errors } } = form;

    // Enable Draft Persistence
    const { clearDraft } = useRoutineDraft(form);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const handleAddExercise = () => {
        const exercise = exercises.find(e => e.id === selectedExerciseId);
        if (!exercise) return;

        append({
            exercise_id: exercise.id,
            name: exercise.title,
            sets: 3,
            reps: '10',
            rest_seconds: 60
        });
        setSelectedExerciseId(''); // Reset selector
    };

    const onSubmit = async (data: RoutineFormValues) => {
        try {
            const payload = {
                name: data.name,
                items: data.items.map((item, index) => ({
                    exercise_id: item.exercise_id,
                    order_index: index,
                    sets: item.sets,
                    reps: item.reps,
                    rest_seconds: item.rest_seconds
                }))
            };

            if (routineId) {
                await api.put(`/routines/${routineId}`, payload);
                showToast(t('routines.form.updateSuccess'), 'success');
            } else {
                await api.post('/routines', payload);
                showToast(t('routines.form.saveSuccess'), 'success');
                clearDraft();
            }
            form.reset();
            navigate('/dashboard/routines/new');
        } catch (error) {
            console.error('Failed to save routine:', error);
            showToast(t('routines.form.saveError'), 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">

            {/* --- HEADER INPUT --- */}
            <div className="space-y-2">
                <input
                    {...register('name', { required: true })}
                    placeholder={t('routines.form.namePlaceholder')}
                    className="w-full bg-transparent text-4xl font-display font-bold text-text-main placeholder-text-muted/50 focus:outline-none border-b border-border focus:border-primary transition-colors pb-2"
                />
                {errors.name && <span className="text-red-500 text-sm">{t('routines.form.nameRequired')}</span>}
            </div>

            {/* --- EXERCISE SELECTOR --- */}
            <Card className="flex flex-col md:flex-row gap-4 items-center bg-background-dark/5 border-dashed border-border/50">
                <div className="p-2 bg-primary/10 rounded-lg text-primary flex items-center justify-center">
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Dumbbell size={24} />}
                </div>

                <div className="flex-1 w-full relative">
                    {exercisesError ? (
                        <div className="text-red-500 text-sm">{t('routines.form.loadExercisesError')}</div>
                    ) : (
                        <select
                            value={selectedExerciseId}
                            onChange={(e) => setSelectedExerciseId(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent text-text-main focus:outline-none [&>option]:bg-surface-dark p-2 border border-transparent focus:border-border rounded disabled:opacity-50"
                        >
                            <option value="">{loading ? t('routines.form.loadingCatalog') : t('routines.form.selectExercise')}</option>
                            {exercises.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                    {ex.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <Button type="button" onClick={handleAddExercise} disabled={!selectedExerciseId || loading}>
                    <Plus size={20} /> {t('routines.form.add')}
                </Button>
            </Card>

            {/* --- ITEMS LIST --- */}
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="relative group animate-slide-up">
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-text-muted/30 font-display text-4xl font-bold">
                            {index + 1}
                        </div>

                        <Card className="bg-surface-dark/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                                {/* Exercise Info */}
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-text-main">{field.name}</h4>
                                    {/* We can fetch muscle target if needed, slightly complex with current structure, skipping for MVP display optimization */}
                                </div>

                                {/* Sets/Reps Inputs */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-text-muted uppercase tracking-wider">{t('routines.form.sets')}</label>
                                        <input
                                            type="number"
                                            {...register(`items.${index}.sets` as const, { valueAsNumber: true })}
                                            className="w-20 bg-background-dark/5 border border-border rounded px-2 py-1 text-text-main text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-text-muted uppercase tracking-wider">{t('routines.form.reps')}</label>
                                        <input
                                            type="text"
                                            {...register(`items.${index}.reps` as const)}
                                            className="w-20 bg-background-dark/5 border border-border rounded px-2 py-1 text-text-main text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-text-muted uppercase tracking-wider">{t('routines.form.rest')}</label>
                                        <input
                                            type="number"
                                            {...register(`items.${index}.rest_seconds` as const, { valueAsNumber: true })}
                                            className="w-20 bg-background-dark/5 border border-border rounded px-2 py-1 text-text-main text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-text-muted hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </Card>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-12 text-text-muted border-2 border-dashed border-border rounded-xl">
                        {t('routines.form.emptyMessage')}
                    </div>
                )}
            </div>

            {/* --- ACTIONS --- */}
            <div className="flex justify-end pt-8 border-t border-border">
                <Button type="submit" className="px-8 py-3 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Save size={20} /> {routineId ? t('routines.form.updateBtn') : t('routines.form.saveBtn')}
                </Button>
            </div>
        </form>
    );
};
