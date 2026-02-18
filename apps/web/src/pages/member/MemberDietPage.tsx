import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Utensils, Coffee, Sun, Moon, Apple } from 'lucide-react';
import api from '../../lib/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const MemberDietPage = () => {
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

    if (isLoading) return <div className="p-8 text-white">Loading nutrition plan...</div>;

    if (!diet) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                <Utensils size={64} className="text-gray-600 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">No Nutrition Plan Assigned</h2>
                <p className="text-gray-400">Your coach hasn't assigned a diet plan yet.</p>
            </div>
        );
    }

    // Fallback to Monday if today is not in DAYS (should not happen usually)
    const currentDayKey = DAYS.includes(activeDay) ? activeDay : 'monday';

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">My Nutrition Plan</h1>
                <p className="text-gray-400">Fuel your body for performance.</p>
            </div>

            {/* Day Selector */}
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-thin scrollbar-thumb-primary/20">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-6 py-3 rounded-full whitespace-nowrap capitalize transition-all border ${activeDay === day
                                ? 'bg-primary text-background-dark border-primary font-bold'
                                : 'bg-surface-dark text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                    const mealContent = diet.content?.[currentDayKey]?.[meal];
                    if (!mealContent) return null;

                    return (
                        <Card key={meal} className="p-6 bg-surface-light border-white/5 hover:border-primary/30 transition-all hover:translate-y-[-2px]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl bg-background-dark/50`}>
                                    {getMealIcon(meal)}
                                </div>
                                <h3 className="text-xl font-bold text-white capitalize">{meal}</h3>
                            </div>
                            <div className="pl-[4.5rem]">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{mealContent}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MemberDietPage;
