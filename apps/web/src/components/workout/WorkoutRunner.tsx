import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, CheckCircle2, Timer, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const MOCK_ACTIVE_ROUTINE = {
    id: 'routine-1',
    name: 'Gladiator Legs',
    exercises: [
        {
            id: 'ex-1',
            title: 'Barbell Squat',
            sets: [
                { id: 's1', reps: 10, weight: 60, completed: false },
                { id: 's2', reps: 10, weight: 60, completed: false },
                { id: 's3', reps: 8, weight: 65, completed: false },
            ],
            video_url: 'https://www.youtube.com/embed/SW_C1A-rejs?si=9Sc9_y77332211', // Placeholder
        },
        {
            id: 'ex-2',
            title: 'Walking Lunges',
            sets: [
                { id: 's1', reps: 12, weight: 20, completed: false },
                { id: 's2', reps: 12, weight: 20, completed: false },
                { id: 's3', reps: 10, weight: 24, completed: false },
            ],
            video_url: 'https://www.youtube.com/embed/L8fvybAfPq4?si=112233', // Placeholder
        },
        {
            id: 'ex-3',
            title: 'Calf Raises',
            sets: [
                { id: 's1', reps: 15, weight: 0, completed: false },
                { id: 's2', reps: 15, weight: 0, completed: false },
                { id: 's3', reps: 15, weight: 0, completed: false },
            ],
            video_url: 'https://www.youtube.com/embed/-M4-G8p8fmc?si=445566', // Placeholder
        }
    ]
};

export const WorkoutRunner = () => {
    const navigate = useNavigate();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [workoutData, setWorkoutData] = useState(MOCK_ACTIVE_ROUTINE);
    const [isCompleted, setIsCompleted] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const currentExercise = workoutData.exercises[currentExerciseIndex];

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
        const newExercises = [...workoutData.exercises];
        const set = newExercises[exerciseIndex].sets[setIndex];
        set.completed = !set.completed;
        setWorkoutData({ ...workoutData, exercises: newExercises });

        // Auto-start timer on completion if not last set
        if (set.completed) {
            setTimerSeconds(0);
            setIsTimerRunning(true);
        }
    };

    const handleNext = () => {
        if (currentExerciseIndex < workoutData.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setIsTimerRunning(false);
            setTimerSeconds(0);
        } else {
            setIsCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        navigate('/dashboard');
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
                {/* Confetti Background Effect (CSS only for now) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                    <div className="absolute top-20 right-1/4 w-3 h-3 bg-secondary rounded-full animate-ping delay-75"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-purple-500 rounded-full animate-ping delay-150"></div>
                </div>

                <div className="mb-8 p-6 bg-primary/10 rounded-full text-primary shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                    <Trophy size={64} />
                </div>
                <h1 className="text-4xl font-display font-bold text-white mb-4">Workout Destroyed!</h1>
                <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                    You've crushed <strong>{workoutData.name}</strong>. Great work, athlete.
                </p>
                <Button variant="primary" onClick={handleFinish} className="w-full max-w-sm py-4 text-lg">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark pb-20 relative">
            {/* --- HEADER --- */}
            <div className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md px-6 py-4 border-b border-white/5">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">
                            Exercise {currentExerciseIndex + 1} of {workoutData.exercises.length}
                        </p>
                        <h2 className="text-2xl font-display font-bold text-white leading-none">
                            {currentExercise.title}
                        </h2>
                    </div>
                    {/* Timer Badge */}
                    <div onClick={() => setIsTimerRunning(!isTimerRunning)} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <Timer size={14} className={isTimerRunning ? "text-primary animate-pulse" : "text-gray-400"} />
                        <span className="font-mono text-sm font-bold text-white">{formatTime(timerSeconds)}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* --- VIDEO PLAYER --- */}
                <div className="aspect-video w-full bg-surface-dark border border-white/10 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden group">
                    {/* Placeholder for iframe */}
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center group-hover:bg-black/30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                    <img
                        src={`https://img.youtube.com/vi/${currentExercise.video_url.split('/embed/')[1]?.split('?')[0]}/hqdefault.jpg`}
                        alt="Exercise Thumbnail"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                {/* --- SET CONTROLS --- */}
                <Card className="space-y-4">
                    <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 mb-2 text-xs text-gray-400 font-bold uppercase tracking-wider text-center">
                        <div className="text-left pl-2">Set</div>
                        <div>Previous</div>
                        <div>Done</div>
                    </div>

                    <div className="space-y-3">
                        {currentExercise.sets.map((set, idx) => (
                            <div key={set.id} className={clsx(
                                "grid grid-cols-[1fr_2fr_1fr] gap-4 items-center p-3 rounded-lg border transition-all duration-300",
                                set.completed ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5"
                            )}>
                                {/* Set Label */}
                                <div className="font-display font-bold text-xl pl-2 text-white">
                                    {idx + 1}
                                </div>

                                {/* Inputs */}
                                <div className="flex gap-2 justify-center">
                                    <input
                                        type="number"
                                        defaultValue={set.weight}
                                        className="w-16 bg-black/20 text-center text-white font-bold rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="kg"
                                    />
                                    <input
                                        type="number"
                                        defaultValue={set.reps}
                                        className="w-12 bg-black/20 text-center text-white font-bold rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="reps"
                                    />
                                </div>

                                {/* Checkbox */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => toggleSetCompletion(currentExerciseIndex, idx)}
                                        className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                            set.completed
                                                ? "bg-primary text-black scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                                : "bg-surface-dark border-2 border-white/10 text-transparent hover:border-white/30"
                                        )}
                                    >
                                        <CheckCircle2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* --- NAVIGATION FOOTER --- */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/90 backdrop-blur-xl border-t border-white/10 flex gap-4">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentExerciseIndex === 0}
                    className="flex-1 py-4 border-white/10 text-gray-400"
                >
                    <ChevronLeft size={20} />
                </Button>

                <Button
                    variant="primary"
                    onClick={handleNext}
                    className="flex-[3] py-4 text-lg font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                    {currentExerciseIndex === workoutData.exercises.length - 1 ? "Finish Workout" : "Next Exercise"}
                    {currentExerciseIndex < workoutData.exercises.length - 1 && <ChevronRight size={20} />}
                </Button>
            </div>
        </div>
    );
};
