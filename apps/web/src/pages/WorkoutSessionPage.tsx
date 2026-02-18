import { WorkoutRunner, type RunnerRoutine } from '../components/workout/WorkoutRunner';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { useEffect, useState } from 'react';

const WorkoutSessionPage = () => {
    const { routineId } = useParams(); // Get routine ID from URL path
    const [searchParams] = useSearchParams();
    const assignmentId = searchParams.get('assignmentId');
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<RunnerRoutine | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            if (!routineId) return;
            try {
                const res = await api.get(`/routines/${routineId}`);
                const routineData = res.data;

                // Transform backend data to RunnerRoutine format
                const formattedWorkout: RunnerRoutine = {
                    id: routineData.id,
                    name: routineData.name,
                    exercises: routineData.items.map((item: any) => ({
                        id: item.id,
                        title: item.exercise.title, // Fixed: name -> title
                        video_url: item.exercise.video_url,
                        description: item.notes,
                        sets: Array.from({ length: item.sets || 3 }).map((_, idx) => ({
                            id: `${item.id}-s${idx}`,
                            reps: item.reps || 0,
                            weight: 0,
                            completed: false,
                            rest_seconds: item.rest_seconds
                        }))
                    }))
                };
                setWorkout(formattedWorkout);
            } catch (error) {
                console.error("Failed to load workout", error);
                alert("Failed to load workout details.");
                navigate('/dashboard/member');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoutine();
    }, [routineId, navigate]);

    const handleComplete = async (feedback: string) => {
        if (assignmentId) {
            try {
                await api.patch(`/assignments/${assignmentId}/complete`, { feedback });
                navigate('/dashboard/member');
            } catch (error) {
                console.error('Failed to complete assignment:', error);
                alert('Failed to save progress. Please try again.');
            }
        } else {
            navigate('/dashboard/member');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">
                Loading workout...
            </div>
        );
    }

    if (!workout) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">
                Workout not found.
            </div>
        );
    }

    return (
        <div className="bg-background-dark min-h-screen">
            <WorkoutRunner workout={workout} onComplete={handleComplete} />
        </div>
    );
};

export default WorkoutSessionPage;
