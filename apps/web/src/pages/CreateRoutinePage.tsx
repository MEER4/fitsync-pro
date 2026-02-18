import { RoutineForm } from '../components/routines/RoutineForm';
import api from '../lib/api';

const CreateRoutinePage = () => {
    const handleSeed = async () => {
        try {
            const res = await api.post('/exercises/seed');
            console.log('Seed result:', res.data);
            alert('Exercises seeded! Reload the page.');
            window.location.reload();
        } catch (e) {
            console.error('Seed error:', e);
            alert('Error seeding exercises');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Design New Strategy</h1>
                    <p className="text-gray-400">Craft a precision routine for your athletes.</p>
                </div>
                <button
                    onClick={handleSeed}
                    className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
                >
                    ⚡ Seed Exercises
                </button>
            </div>

            <RoutineForm />
        </div>
    );
};

export default CreateRoutinePage;
