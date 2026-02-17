import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Save, Trash2, Dumbbell, Loader2 } from 'lucide-react';
import { useExercises } from '../../hooks/useExercises';

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

export const RoutineForm = () => {
    const { exercises, loading, error: exercisesError } = useExercises();
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

    const { register, control, handleSubmit, formState: { errors } } = useForm<RoutineFormValues>({
        defaultValues: {
            name: '',
            items: []
        }
    });

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

    const onSubmit = (data: RoutineFormValues) => {
        console.log("Saving Routine (Real Data Pending):", data);
        // TODO: Implement actual Save Routine to Backend
        alert("Routine payload prepared! (Check Console)");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">

            {/* --- HEADER INPUT --- */}
            <div className="space-y-2">
                <input
                    {...register('name', { required: true })}
                    placeholder="Routine Name (e.g. Hypertrophy Phase 1)"
                    className="w-full bg-transparent text-4xl font-display font-bold text-white placeholder-white/20 focus:outline-none border-b border-white/10 focus:border-primary transition-colors pb-2"
                />
                {errors.name && <span className="text-red-400 text-sm">Routine name is required</span>}
            </div>

            {/* --- EXERCISE SELECTOR --- */}
            <Card className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border-dashed border-white/20">
                <div className="p-2 bg-primary/10 rounded-lg text-primary flex items-center justify-center">
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Dumbbell size={24} />}
                </div>

                <div className="flex-1 w-full relative">
                    {exercisesError ? (
                        <div className="text-red-400 text-sm">Failed to load exercises. Please try again.</div>
                    ) : (
                        <select
                            value={selectedExerciseId}
                            onChange={(e) => setSelectedExerciseId(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent text-white focus:outline-none [&>option]:bg-surface-dark p-2 border border-transparent focus:border-white/10 rounded disabled:opacity-50"
                        >
                            <option value="">{loading ? 'Loading Catalog...' : 'Select an exercise to add...'}</option>
                            {exercises.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                    {ex.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <Button type="button" onClick={handleAddExercise} disabled={!selectedExerciseId || loading}>
                    <Plus size={20} /> Add
                </Button>
            </Card>

            {/* --- ITEMS LIST --- */}
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="relative group animate-slide-up">
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-white/20 font-display text-4xl font-bold">
                            {index + 1}
                        </div>

                        <Card className="bg-surface-dark/50 backdrop-blur-sm border-white/5 hover:border-primary/30 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                                {/* Exercise Info */}
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white">{field.name}</h4>
                                    {/* We can fetch muscle target if needed, slightly complex with current structure, skipping for MVP display optimization */}
                                </div>

                                {/* Sets/Reps Inputs */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Sets</label>
                                        <input
                                            type="number"
                                            {...register(`items.${index}.sets` as const, { valueAsNumber: true })}
                                            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Reps</label>
                                        <input
                                            type="text"
                                            {...register(`items.${index}.reps` as const)}
                                            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Rest (s)</label>
                                        <input
                                            type="number"
                                            {...register(`items.${index}.rest_seconds` as const, { valueAsNumber: true })}
                                            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-center focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </Card>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                        No exercises added yet. Start building your strategy above.
                    </div>
                )}
            </div>

            {/* --- ACTIONS --- */}
            <div className="flex justify-end pt-8 border-t border-white/10">
                <Button type="submit" className="px-8 py-3 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Save size={20} /> Save Strategy
                </Button>
            </div>
        </form>
    );
};
