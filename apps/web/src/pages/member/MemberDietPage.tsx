import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Utensils, Coffee, Sun, Moon, Apple } from 'lucide-react';
import api from '../../lib/api';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const MemberDietPage = () => {
    const { t } = useTranslation();
    const [diet, setDiet] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase());

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const res = await api.get('/diets/my-diet');
                setDiet(res.data);
            } catch (error) {
                console.error("Failed to fetch diet", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDiet();
    }, []);

    const getMealIcon = (meal: string) => {
        switch (meal) {
            case 'breakfast': return <Coffee className="text-yellow-400" size={24} />;
            case 'lunch': return <Sun className="text-orange-400" size={24} />;
            case 'dinner': return <Moon className="text-indigo-400" size={24} />;
            case 'snack': return <Apple className="text-green-400" size={24} />;
            default: return <Utensils className="text-primary" size={24} />;
        }
    };

    if (isLoading) return <div className="p-8 text-text-main">{t('common.loading')}</div>;

    if (!diet) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                <Utensils size={64} className="text-text-muted mb-6" />
                <h2 className="text-2xl font-bold text-text-main mb-2">{t('diet.noPlanTitle')}</h2>
                <p className="text-text-muted">{t('diet.noPlanDesc')}</p>
            </div>
        );
    }

    const currentDayKey = DAYS.includes(activeDay) ? activeDay : 'monday';
    const targets = diet.content?.targets;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{diet.name || t('diet.defaultTitle')}</h1>
                <p className="text-text-muted">{t('diet.subtitle')}</p>
            </div>

            {/* Diet Targets */}
            {targets && (targets.calories || targets.protein || targets.carbs || targets.fats) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {targets.calories && (
                        <Card className="p-4 bg-surface-dark border-border/10 flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-text-muted text-sm mb-1">{t('diet.calories') || 'Calories'}</span>
                            <span className="text-2xl font-bold text-primary">{targets.calories}{' '}<span className="text-sm font-normal text-text-muted">kcal</span></span>
                        </Card>
                    )}
                    {targets.protein && (
                        <Card className="p-4 bg-surface-dark border-border/10 flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-text-muted text-sm mb-1">{t('diet.protein') || 'Protein'}</span>
                            <span className="text-2xl font-bold text-text-main">{targets.protein}{' '}<span className="text-sm font-normal text-text-muted">g</span></span>
                        </Card>
                    )}
                    {targets.carbs && (
                        <Card className="p-4 bg-surface-dark border-border/10 flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-text-muted text-sm mb-1">{t('diet.carbohydrates') || 'Carbs'}</span>
                            <span className="text-2xl font-bold text-text-main">{targets.carbs}{' '}<span className="text-sm font-normal text-text-muted">g</span></span>
                        </Card>
                    )}
                    {targets.fats && (
                        <Card className="p-4 bg-surface-dark border-border/10 flex flex-col items-center justify-center text-center shadow-lg">
                            <span className="text-text-muted text-sm mb-1">{t('diet.fats') || 'Fats'}</span>
                            <span className="text-2xl font-bold text-text-main">{targets.fats}{' '}<span className="text-sm font-normal text-text-muted">g</span></span>
                        </Card>
                    )}
                </div>
            )}

            {/* Day Selector */}
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-thin scrollbar-thumb-primary/20">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={cn(
                            "px-6 py-3 rounded-full whitespace-nowrap capitalize transition-all border",
                            activeDay === day
                                ? 'bg-primary text-background-dark border-primary font-bold shadow-lg shadow-primary/20'
                                : 'bg-surface-dark text-text-muted border-border/10 hover:border-primary/30'
                        )}
                    >
                        {t(`days.${day.toLowerCase()}`)}
                    </button>
                ))}
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                    const mealContent = diet.content?.[currentDayKey]?.[meal];
                    if (!mealContent) return null;

                    return (
                        <Card key={meal} className="p-6 bg-surface-dark border-border/10 hover:border-primary/30 transition-all hover:translate-y-[-2px] shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl bg-background-dark/10`}>
                                    {getMealIcon(meal)}
                                </div>
                                <h3 className="text-xl font-bold text-text-main capitalize">
                                    {t(`mealNames.${meal.toLowerCase()}`)}
                                </h3>
                            </div>
                            <div className="pl-[4.5rem]">
                                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">{mealContent}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MemberDietPage;
