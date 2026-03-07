import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Activity, Edit2 } from 'lucide-react';
import api from '../../lib/api';

interface Routine {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    _count?: {
        exercises: number;
        assignments: number;
    }
}

const RoutinesPage = () => {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/routines');
            setRoutines(response.data);
        } catch (error) {
            console.error('Failed to fetch routines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRoutines = routines.filter(routine =>
        routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (routine.description && routine.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-main mb-2">Mis Rutinas</h1>
                    <p className="text-text-muted">Gestiona el catálogo de rutinas que has diseñado.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/routines/new')} className="gap-2">
                    <Activity size={18} />
                    Crear Nueva Rutina
                </Button>
            </div>

            <Card className="p-4 bg-surface-dark/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full bg-background-dark border border-border/10 rounded-lg pl-10 pr-4 py-2 text-text-main focus:outline-none focus:border-primary/50 placeholder:text-text-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-10 text-text-muted">Cargando rutinas...</div>
                ) : filteredRoutines.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-text-muted">
                        {searchTerm ? 'No se encontraron rutinas.' : 'Aún no has creado rutinas.'}
                    </div>
                ) : (
                    filteredRoutines.map(routine => (
                        <Card key={routine.id} className="p-6 bg-surface-dark border-border/10 hover:border-primary/30 transition-all flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 group-hover:bg-primary transition-colors"></div>

                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Activity size={24} />
                                </div>
                                <span className="text-xs text-text-muted">
                                    {new Date(routine.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-text-main mb-2 pl-3">{routine.name}</h3>
                            <p className="text-sm text-text-muted mb-6 line-clamp-2 pl-3">
                                {routine.description || 'Sin descripción'}
                            </p>

                            <div className="mt-auto pl-3 flex items-center justify-between pt-4 border-t border-border/10">
                                <Button
                                    variant="outline"
                                    className="gap-2 w-full justify-center hover:bg-primary hover:text-background-dark hover:border-primary transition-all"
                                    onClick={() => navigate(`/dashboard/routines/${routine.id}/edit`)}
                                >
                                    <Edit2 size={16} />
                                    Editar Rutina
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoutinesPage;
