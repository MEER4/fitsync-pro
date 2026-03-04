import { useForm } from 'react-hook-form';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Save, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<ExerciseFormValues>({
        defaultValues: initialData || {
            title: '',
            description: '',
            video_url: '',
            thumbnail_url: ''
        }
    });

    return (
        <Card className="p-6 bg-surface-dark border-border">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-main">
                    {initialData ? t('exercises.form.editTitle') : t('exercises.form.newTitle')}
                </h3>
                <button onClick={onCancel} className="text-text-muted hover:text-text-main">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">{t('exercises.form.titleLabel')}</label>
                    <input
                        {...register('title', { required: t('exercises.form.titleRequired') })}
                        className="w-full bg-background-dark/5 border border-border rounded-lg p-3 text-text-main focus:border-primary focus:outline-none"
                        placeholder={t('exercises.form.titlePlaceholder')}
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">{t('exercises.form.descLabel')}</label>
                    <textarea
                        {...register('description')}
                        className="w-full bg-background-dark/5 border border-border rounded-lg p-3 text-text-main focus:border-primary focus:outline-none min-h-[100px]"
                        placeholder={t('exercises.form.descPlaceholder')}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">{t('exercises.form.thumbLabel')}</label>
                    <input
                        {...register('thumbnail_url')}
                        className="w-full bg-background-dark/5 border border-border rounded-lg p-3 text-text-main focus:border-primary focus:outline-none"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">{t('exercises.form.videoLabel')}</label>
                    <input
                        {...register('video_url', { required: t('exercises.form.videoRequired') })}
                        className="w-full bg-background-dark/5 border border-border rounded-lg p-3 text-text-main focus:border-primary focus:outline-none"
                        placeholder="https://youtube.com/..."
                    />
                    {errors.video_url && <span className="text-red-500 text-sm">{errors.video_url.message}</span>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        {t('exercises.form.cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span className="ml-2">
                            {initialData ? t('exercises.form.saveChanges') : t('exercises.form.createExercise')}
                        </span>
                    </Button>
                </div>
            </form>
        </Card>
    );
};
