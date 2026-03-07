import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Dumbbell, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useToast } from '../../context/ToastContext';

interface DietTemplate {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export default function DietTemplatesPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [templates, setTemplates] = useState<DietTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const dateLocale = i18n.language === 'es' ? es : enUS;

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/diet-templates');
                setTemplates(res.data);
            } catch (error) {
                console.error('Failed to fetch diet templates:', error);
                showToast(t('common.error'), 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, [t, showToast]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown !== null) {
                const target = event.target as HTMLElement;
                if (!target.closest('.dropdown-container')) {
                    setActiveDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('common.confirmDelete') || 'Are you sure?')) return;
        try {
            await api.delete(`/diet-templates/${id}`);
            setTemplates(templates.filter(t => t.id !== id));
            showToast(t('common.success'), 'success');
        } catch (error) {
            console.error('Failed to delete template:', error);
            showToast(t('common.error'), 'error');
        }
        setActiveDropdown(null);
    };

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-main">
                        Plantillas de Dieta
                    </h1>
                    <p className="text-text-muted mt-1">
                        Crea y administra plantillas nutricionales para asignar rápidamente.
                    </p>
                </div>
                <Button onClick={() => navigate('/dashboard/diet-templates/new')} className="w-full sm:w-auto flex items-center gap-2">
                    <Plus size={20} />
                    Nueva Plantilla
                </Button>
            </div>

            <Card className="p-4 sm:p-6 bg-surface-dark border-border/10">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="text"
                            placeholder={t('common.search') || 'Buscar...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-text-main/5 border border-border/10 rounded-lg text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-text-main/5 h-48 rounded-xl border border-border/10"></div>
                        ))}
                    </div>
                ) : filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-text-main/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Dumbbell className="text-text-muted" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">No hay plantillas</h3>
                        <p className="text-text-muted mb-6">
                            {searchQuery ? 'No se encontraron resultados' : 'Aún no has creado ninguna plantilla de dieta.'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => navigate('/dashboard/diet-templates/new')}>
                                Crear Mi Primera Plantilla
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <div key={template.id} className="group bg-text-main/5 rounded-xl border border-border/10 overflow-hidden hover:border-primary/50 transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-display font-medium text-lg text-text-main line-clamp-1">{template.name}</h3>
                                        <div className="relative dropdown-container">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === template.id ? null : template.id)}
                                                className="p-1 text-text-muted hover:text-text-main rounded transition-colors"
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            {activeDropdown === template.id && (
                                                <div className="absolute right-0 mt-1 w-48 bg-surface-dark border border-border/10 rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/dashboard/diet-templates/${template.id}/edit`);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-text-main/5 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={16} />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(template.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-text-muted text-sm mb-6 line-clamp-2">
                                        {template.description || 'Sin descripción'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-text-muted border-t border-border/10 pt-4 mt-auto">
                                        <span>
                                            Creada: {format(new Date(template.created_at), 'd MMM yyyy', { locale: dateLocale })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
