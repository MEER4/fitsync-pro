import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../lib/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];

const CoachDietPage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeDay, setActiveDay] = useState('monday');
    const [diet, setDiet] = useState<any>({
        name: 'Weekly Plan',
        content: {}
    });

    useEffect(() => {
        fetchDiet();
    }, [memberId]);

    const fetchDiet = async () => {
        try {
            const res = await api.get(`/diets/member/${memberId}`);
            if (res.data) {
                setDiet({
                    name: res.data.name,
                    content: res.data.content || {}
                });
            } else {
                // Initialize empty diet structure
                const emptyContent: any = {};
                DAYS.forEach(day => {
                    emptyContent[day] = {};
                    MEALS.forEach(meal => {
                        emptyContent[day][meal] = '';
                    });
                });
                setDiet({ name: 'Weekly Plan', content: emptyContent });
            }
        } catch (error) {
            console.error("Failed to fetch diet", error);
        } finally {
            setIsLoading(false);
        }
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
            alert('Diet saved successfully');
        } catch (error) {
            console.error("Failed to save diet", error);
            alert('Failed to save diet');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/dashboard/members')}>
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-display font-bold text-white">Edit Nutrition Plan</h1>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save size={20} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Plan'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Day Selector */}
                <Card className="p-4 bg-surface-dark h-fit lg:col-span-1">
                    <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">Days of Week</h3>
                    <div className="space-y-2">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-all ${activeDay === day
                                    ? 'bg-primary text-background-dark font-bold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Meal Editor */}
                <Card className="p-6 bg-surface-dark lg:col-span-3">
                    <h2 className="text-2xl font-bold text-white mb-6 capitalize">{activeDay} Meals</h2>
                    <div className="space-y-6">
                        {MEALS.map(meal => (
                            <div key={meal}>
                                <label className="block text-primary font-bold mb-2 capitalize text-sm">{meal}</label>
                                <textarea
                                    className="w-full bg-background-dark border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary/50 min-h-[100px]"
                                    placeholder={`Enter ${meal} plan...`}
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
