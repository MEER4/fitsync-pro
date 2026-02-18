import { WorkoutRunner } from '../components/workout/WorkoutRunner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const WorkoutSessionPage = () => {
    const [searchParams] = useSearchParams();
    const assignmentId = searchParams.get('assignmentId');
    const navigate = useNavigate();

    const handleComplete = async (feedback: string) => {
        if (assignmentId) {
            try {
                await api.patch(`/assignments/${assignmentId}/complete`, { feedback });
                navigate('/dashboard/member'); // Go back to member dashboard
            } catch (error) {
                console.error('Failed to complete assignment:', error);
                alert('Failed to save progress. Please try again.');
            }
        } else {
            // If no assignment ID (e.g. ad-hoc workout), just go back
            navigate('/dashboard');
        }
    };

    return (
        <div className="bg-background-dark min-h-screen">
            <WorkoutRunner onComplete={handleComplete} />
        </div>
    );
};

export default WorkoutSessionPage;
