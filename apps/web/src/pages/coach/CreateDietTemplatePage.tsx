import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save, Target } from 'lucide-react';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];

const CreateDietTemplatePage = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(templateId ? true : false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeDay, setActiveDay] = useState('monday');
    const [template, setTemplate] = useState<any>({
        name: '',
        description: '',
        content: {
            targets: { calories: '', protein: '', carbs: '', fats: '' }
        }
    });

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        } else {
            // Initialize empty diet structure
            const emptyContent: any = { targets: { calories: '', protein: '', carbs: '', fats: '' } };
            DAYS.forEach(day => {
                emptyContent[day] = {};
                MEALS.forEach(meal => {
                    emptyContent[day][meal] = '';
                });
            });
            setTemplate({ name: '', description: '', content: emptyContent });
        }
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            const res = await api.get(`/diet-templates/${templateId}`);
            if (res.data) {
                const content = res.data.content || {};
                setTemplate({
                    name: res.data.name || '',
                    description: res.data.description || '',
                    content: {
                        ...content,
                        targets: content.targets || { calories: '', protein: '', carbs: '', fats: '' }
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch template", error);
            showToast(t('common.error'), 'error');
            navigate('/dashboard/diet-templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTargetChange = (field: string, value: string) => {
        setTemplate((prev: any) => ({
            ...prev,
            content: {
                ...prev.content,
                targets: {
                    ...prev.content.targets,
                    [field]: value
                }
            }
        }));
    };

    const handleMealChange = (day: string, meal: string, value: string) => {
        setTemplate((prev: any) => ({
            ...prev,
            content: {
                ...prev.content,
                [day]: {
                    ...prev.content[day],
                    [meal]: value
                }
            }
        }));
    };

    const handleSave = async () => {
        if (!template.name) {
            showToast('El nombre es obligatorio', 'error');
            return;
        }

        setIsSaving(true);
        try {
            if (templateId) {
                await api.put(`/diet-templates/${templateId}`, {
                    name: template.name,
                    description: template.description,
                    content: template.content,
                });
                showToast(t('common.success'), 'success');
            } else {
                await api.post('/diet-templates', {
                    name: template.name,
                    description: template.description,
                    content: template.content,
                });
                showToast(t('common.success'), 'success');
                navigate('/dashboard/diet-templates');
            }
        } catch (error) {
            console.error("Failed to save template", error);
            showToast(t('common.error'), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-text-muted">Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/diet-templates')}>
                        <ArrowLeft size={20} className="sm:mr-2" /> <span className="hidden sm:inline">Volver</span>
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-main truncate">
                        {templateId ? 'Editar Plantilla' : 'Nueva Plantilla'}
                    </h1>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto flex items-center justify-center">
                    <Save size={20} className="mr-2" />
                    {isSaving ? t('common.loading') : t('common.save')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Template Info */}
                <Card className="p-6 bg-surface-dark lg:col-span-4 border-border/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Nombre de la Plantilla *</label>
                            <input
                                type="text"
                                value={template.name}
                                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="Ej: Dieta Volumen 3000 kcal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Descripción (Opcional)</label>
                            <input
                                type="text"
                                value={template.description || ''}
                                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="Breve objetivo de esta dieta"
                            />
                        </div>
                    </div>
                </Card>

                {/* Diet Targets */}
                <Card className="p-6 bg-surface-dark lg:col-span-4 border-border/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Target size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">{t('diet.macroTargets')}</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.calories')}</label>
                            <input
                                type="number"
                                value={template.content.targets?.calories || ''}
                                onChange={(e) => handleTargetChange('calories', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 2500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.protein')}</label>
                            <input
                                type="number"
                                value={template.content.targets?.protein || ''}
                                onChange={(e) => handleTargetChange('protein', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.carbohydrates')}</label>
                            <input
                                type="number"
                                value={template.content.targets?.carbs || ''}
                                onChange={(e) => handleTargetChange('carbs', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.fats')}</label>
                            <input
                                type="number"
                                value={template.content.targets?.fats || ''}
                                onChange={(e) => handleTargetChange('fats', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 70"
                            />
                        </div>
                    </div>
                </Card>

                {/* Day Selector */}
                <Card className="p-4 bg-surface-dark h-fit lg:col-span-1 border-border/10">
                    <h3 className="text-text-muted font-bold mb-4 uppercase text-xs tracking-wider">{t('diet.daysOfWeek')}</h3>
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 scrollbar-none">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`flex-none lg:w-full text-center lg:text-left px-4 py-3 rounded-lg capitalize transition-all whitespace-nowrap ${activeDay === day
                                    ? 'bg-primary text-background-dark font-bold'
                                    : 'text-text-muted hover:bg-text-main/5 hover:text-text-main'
                                    }`}
                            >
                                {t(`days.${day}`)}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Meal Editor */}
                <Card className="p-6 bg-surface-dark lg:col-span-3 border-border/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-text-main capitalize">{t('diet.meals', { day: t(`days.${activeDay}`) })}</h2>

                        {/* Copy Day Feature */}
                        <div className="relative group">
                            <Button variant="outline" size="sm" onClick={() => {
                                const confirmCopy = window.confirm(`¿Copiar ${t(`days.${activeDay}`)} a toda la semana?`);
                                if (confirmCopy) {
                                    const sourceContent = template.content[activeDay];
                                    setTemplate((prev: any) => {
                                        const newContent = { ...prev.content };
                                        DAYS.forEach(d => {
                                            newContent[d] = { ...sourceContent };
                                        });
                                        return { ...prev, content: newContent };
                                    });
                                    showToast('Día copiado a toda la semana', 'success');
                                }
                            }}>
                                Copiar a todos
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {MEALS.map(meal => (
                            <div key={meal}>
                                <label className="block text-primary font-bold mb-2 capitalize text-sm">{t(`mealNames.${meal}`)}</label>
                                <textarea
                                    className="w-full bg-background-dark border border-border/10 rounded-lg p-4 text-text-main focus:outline-none focus:border-primary/50 min-h-[100px] placeholder:text-text-muted"
                                    placeholder={t('diet.enterPlan', { meal: t(`mealNames.${meal}`) })}
                                    value={template.content[activeDay]?.[meal] || ''}
                                    onChange={(e) => handleMealChange(activeDay, meal, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreateDietTemplatePage;
