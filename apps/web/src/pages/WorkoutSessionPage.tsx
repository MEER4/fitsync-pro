import { WorkoutRunner } from '../components/workout/WorkoutRunner';

const WorkoutSessionPage = () => {
    // In a real app, use useParams to fetch routine data
    return (
        <div className="bg-background-dark min-h-screen">
            <WorkoutRunner />
        </div>
    );
};

export default WorkoutSessionPage;
