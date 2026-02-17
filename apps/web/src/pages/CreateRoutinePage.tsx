import { RoutineForm } from '../components/routines/RoutineForm';

const CreateRoutinePage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Design New Strategy</h1>
                <p className="text-gray-400">Craft a precision routine for your athletes.</p>
            </div>

            <RoutineForm />
        </div>
    );
};

export default CreateRoutinePage;
