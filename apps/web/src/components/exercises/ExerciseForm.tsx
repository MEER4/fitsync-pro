import { useForm } from 'react-hook-form';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Save, Loader2, X } from 'lucide-react';

export type ExerciseFormValues = {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
};

interface ExerciseFormProps {
    initialData?: any;
    onSubmit: (data: ExerciseFormValues) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ExerciseForm = ({ initialData, onSubmit, onCancel, isLoading }: ExerciseFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ExerciseFormValues>({
        defaultValues: initialData || {
            title: '',
            description: '',
            video_url: '',
            thumbnail_url: ''
        }
    });

    return (
        <Card className="p-6 bg-surface-dark border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                    {initialData ? 'Edit Exercise' : 'New Exercise'}
                </h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        placeholder="e.g. Barbell Squat"
                    />
                    {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        {...register('description')}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none min-h-[100px]"
                        placeholder="Instructions, cues, etc."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Thumbnail Image URL</label>
                    <input
                        {...register('thumbnail_url')}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Video URL (YouTube)</label>
                    <input
                        {...register('video_url', { required: 'Video URL is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        placeholder="https://youtube.com/..."
                    />
                    {errors.video_url && <span className="text-red-400 text-sm">{errors.video_url.message}</span>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span className="ml-2">
                            {initialData ? 'Save Changes' : 'Create Exercise'}
                        </span>
                    </Button>
                </div>
            </form>
        </Card>
    );
};
