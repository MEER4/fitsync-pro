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

const CoachDietPage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeDay, setActiveDay] = useState('monday');
    const [diet, setDiet] = useState<any>({
        name: 'Weekly Plan',
        content: {
            targets: { calories: '', protein: '', carbs: '', fats: '' }
        }
    });

    useEffect(() => {
        fetchDiet();
    }, [memberId]);

    const fetchDiet = async () => {
        try {
            const res = await api.get(`/diets/member/${memberId}`);
            if (res.data) {
                const content = res.data.content || {};
                setDiet({
                    name: res.data.name || t('diet.weeklyPlan'),
                    content: {
                        ...content,
                        targets: content.targets || { calories: '', protein: '', carbs: '', fats: '' }
                    }
                });
            } else {
                // Initialize empty diet structure
                const emptyContent: any = { targets: { calories: '', protein: '', carbs: '', fats: '' } };
                DAYS.forEach(day => {
                    emptyContent[day] = {};
                    MEALS.forEach(meal => {
                        emptyContent[day][meal] = '';
                    });
                });
                setDiet({ name: t('diet.weeklyPlan'), content: emptyContent });
            }
        } catch (error) {
            console.error("Failed to fetch diet", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTargetChange = (field: string, value: string) => {
        setDiet((prev: any) => ({
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
        setDiet((prev: any) => ({
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
        setIsSaving(true);
        try {
            await api.post('/diets', {
                memberId,
                content: diet.content,
                name: diet.name
            });
            // Show toast or success message (simple alert for now)
            showToast(t('diet.savedSuccess'), 'success');
        } catch (error) {
            console.error("Failed to save diet", error);
            showToast(t('diet.saveError'), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-text-muted">Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/dashboard/members')}>
                        <ArrowLeft size={20} className="mr-2" /> {t('diet.back')}
                    </Button>
                    <h1 className="text-3xl font-display font-bold text-text-main">{t('diet.title')}</h1>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save size={20} className="mr-2" />
                    {isSaving ? t('diet.saving') : t('diet.save')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                                value={diet.content.targets?.calories || ''}
                                onChange={(e) => handleTargetChange('calories', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 2500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.protein')}</label>
                            <input
                                type="number"
                                value={diet.content.targets?.protein || ''}
                                onChange={(e) => handleTargetChange('protein', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.carbohydrates')}</label>
                            <input
                                type="number"
                                value={diet.content.targets?.carbs || ''}
                                onChange={(e) => handleTargetChange('carbs', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background-dark border border-border/10 text-text-main focus:border-primary transition-colors focus:outline-none placeholder:text-text-muted/50"
                                placeholder="e.g. 300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('diet.fats')}</label>
                            <input
                                type="number"
                                value={diet.content.targets?.fats || ''}
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
                    <div className="space-y-2">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-all ${activeDay === day
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
                    <h2 className="text-2xl font-bold text-text-main mb-6 capitalize">{t('diet.meals', { day: t(`days.${activeDay}`) })}</h2>
                    <div className="space-y-6">
                        {MEALS.map(meal => (
                            <div key={meal}>
                                <label className="block text-primary font-bold mb-2 capitalize text-sm">{t(`mealNames.${meal}`)}</label>
                                <textarea
                                    className="w-full bg-background-dark border border-border/10 rounded-lg p-4 text-text-main focus:outline-none focus:border-primary/50 min-h-[100px] placeholder:text-text-muted"
                                    placeholder={t('diet.enterPlan', { meal: t(`mealNames.${meal}`) })}
                                    value={diet.content[activeDay]?.[meal] || ''}
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

export default CoachDietPage;
