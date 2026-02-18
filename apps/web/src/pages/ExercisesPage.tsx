import { useState } from 'react';
import { useExercises } from '../hooks/useExercises'; // Assuming this hook exists from previous tasks
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Video, Search } from 'lucide-react';
import { ExerciseForm } from '../components/exercises/ExerciseForm';
import api from '../lib/api';

const ExercisesPage = () => {
    const { exercises, loading, refetch } = useExercises();
    const [isCreating, setIsCreating] = useState(false);
    const [editingExercise, setEditingExercise] = useState<any>(null); // Replace 'any' with appropriate type later
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return;

        try {
            await api.delete(`/exercises/${id}`);
            refetch();
        } catch (e) {
            console.error('Failed to delete exercise', e);
            alert('Failed to delete exercise');
        }
    };

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingExercise) {
                await api.patch(`/exercises/${editingExercise.id}`, data);
            } else {
                await api.post('/exercises', {
                    ...data,
                    min_reps: 0,
                    max_reps: 0,
                    video_source: 'youtube'
                });
            }
            refetch();
            setIsCreating(false);
            setEditingExercise(null);
        } catch (error) {
            console.error('Failed to save exercise', error);
            alert('Failed to save exercise. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = (exercise: any) => {
        setEditingExercise(exercise);
        setIsCreating(true);
    };

    const filteredExercises = exercises.filter(ex =>
        ex.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Exercise Library</h1>
                    <p className="text-gray-400">Manage your collection of movements.</p>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus size={20} /> Create New
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="max-w-2xl mx-auto animate-slide-up">
                    <ExerciseForm
                        initialData={editingExercise}
                        onSubmit={handleSave}
                        isLoading={isSubmitting}
                        onCancel={() => {
                            setIsCreating(false);
                            setEditingExercise(null);
                        }}
                    />
                </div>
            )}

            {!isCreating && (
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-dark border border-white/5 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredExercises.map(ex => (
                            <Card key={ex.id} className="group hover:border-primary/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    {ex.thumbnail_url ? (
                                        <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
                                            <img
                                                src={ex.thumbnail_url}
                                                alt={ex.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg text-white">
                                                <Video size={16} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                            <Video size={20} />
                                        </div>
                                    )}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEditing(ex)}
                                            className="text-gray-500 hover:text-primary transition-colors"
                                            title="Edit Exercise"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ex.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors"
                                            title="Delete Exercise"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1">{ex.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{ex.description || 'No description provided.'}</p>

                                {ex.video_url && (
                                    <a
                                        href={ex.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-sm hover:underline flex items-center gap-1"
                                    >
                                        Watch Video ↗
                                    </a>
                                )}
                            </Card>
                        ))}
                    </div>

                    {filteredExercises.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            No exercises found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExercisesPage;
