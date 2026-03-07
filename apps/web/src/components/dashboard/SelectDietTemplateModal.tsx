import { useState, useEffect } from 'react';
import { Search, Utensils, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../lib/api';

interface DietTemplate {
    id: string;
    name: string;
    description: string | null;
    content: any;
}

interface SelectDietTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: DietTemplate) => void;
}

export const SelectDietTemplateModal = ({ isOpen, onClose, onSelect }: SelectDietTemplateModalProps) => {
    const [templates, setTemplates] = useState<DietTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/diet-templates');
            setTemplates(res.data);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-lg rounded-2xl border border-border/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-border/10 flex items-center justify-between bg-surface-dark/50">
                    <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                        <Utensils className="text-primary" size={20} />
                        Cargar desde Plantilla
                    </h2>
                    <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main rounded-full hover:bg-text-main/5 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-border/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar plantilla..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-text-main/5 border border-border/10 rounded-lg text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="text-center py-8 text-text-muted">Cargando plantillas...</div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            No se encontraron plantillas.
                        </div>
                    ) : (
                        filteredTemplates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    onSelect(template);
                                    onClose();
                                }}
                                className="w-full text-left p-4 rounded-xl border border-border/10 hover:border-primary/50 hover:bg-text-main/5 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-text-main group-hover:text-primary transition-colors">{template.name}</h3>
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Check className="text-primary" size={14} />
                                    </div>
                                </div>
                                {template.description && (
                                    <p className="text-sm text-text-muted line-clamp-2">{template.description}</p>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-border/10 bg-surface-dark/50 flex justify-end">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
};
