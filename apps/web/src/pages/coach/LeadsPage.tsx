import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Mail, Phone, Target, Dumbbell, Calendar, Trash2, Eye, Clock } from 'lucide-react';
import api from '../../lib/api';

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    age?: string;
    weight?: string;
    height?: string;
    gender?: string;
    goal?: string;
    plan?: string;
    experience_level?: string;
    availability?: string;
    medical_conditions?: string;
    contact_preference?: string;
    status?: string;
    created_at?: string;
}

const LeadsPage = () => {
    const { t } = useTranslation();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (error) {
            console.error('Failed to fetch leads', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/leads/${id}/status`, { status });
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        } catch (error) {
            console.error('Failed to update lead status', error);
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm(t('leads.deleteConfirm'))) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(prev => prev.filter(l => l.id !== id));
            if (selectedLead?.id === id) setSelectedLead(null);
        } catch (error) {
            console.error('Failed to delete lead', error);
        }
    };

    const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'new': return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'contacted': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            case 'converted': return 'text-primary bg-primary/10 border-primary/30';
            case 'lost': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
            default: return 'text-green-400 bg-green-500/10 border-green-500/30';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'new': return t('leads.statusNew');
            case 'contacted': return t('leads.statusContacted');
            case 'converted': return t('leads.statusConverted');
            case 'lost': return t('leads.statusLost');
            default: return t('leads.statusNew');
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-DO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-text-main mb-2">{t('leads.title')}</h2>
                    <p className="text-text-muted">{t('leads.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-dark rounded-xl p-1 border border-border/10">
                    {['all', 'new', 'contacted', 'converted', 'lost'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            {f === 'all' ? t('leads.filterAll') : getStatusLabel(f)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserPlus size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-main">{t('leads.noLeads')}</h3>
                    <p className="text-text-muted max-w-md mx-auto">{t('leads.noLeadsDesc')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Leads List */}
                    <div className="lg:col-span-2 space-y-3">
                        {filteredLeads.map(lead => (
                            <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className={`group relative overflow-hidden rounded-2xl bg-surface-dark border p-5 cursor-pointer transition-all hover:shadow-lg ${selectedLead?.id === lead.id ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-border/10 hover:border-primary/30'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                                            {lead.full_name[0]?.toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-display font-bold text-text-main truncate">{lead.full_name}</h4>
                                            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                                                {lead.phone && <span className="flex items-center gap-1 hidden md:flex"><Phone size={12} /> {lead.phone}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                                            {getStatusLabel(lead.status)}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                                    {lead.plan && <span className="flex items-center gap-1"><Target size={12} /> {lead.plan}</span>}
                                    {lead.goal && <span className="flex items-center gap-1"><Dumbbell size={12} /> {lead.goal}</span>}
                                    <span className="flex items-center gap-1 ml-auto"><Clock size={12} /> {formatDate(lead.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lead Detail Panel */}
                    <div className="lg:col-span-1">
                        {selectedLead ? (
                            <div className="sticky top-6 rounded-2xl bg-surface-dark border border-border/10 p-6 space-y-6 animate-fade-in">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-3">
                                        {selectedLead.full_name[0]?.toUpperCase()}
                                    </div>
                                    <h3 className="font-display font-bold text-xl text-text-main">{selectedLead.full_name}</h3>
                                    <p className="text-text-muted text-sm">{selectedLead.email}</p>
                                </div>

                                {/* Status Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    {['new', 'contacted', 'converted', 'lost'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(selectedLead.id, s)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${selectedLead.status === s ? getStatusColor(s) : 'border-border/10 text-text-muted hover:border-border/30'}`}
                                        >
                                            {getStatusLabel(s)}
                                        </button>
                                    ))}
                                </div>

                                {/* Details */}
                                <div className="space-y-3 text-sm">
                                    {selectedLead.phone && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.phone')}</span><span className="text-text-main">{selectedLead.phone}</span></div>
                                    )}
                                    {selectedLead.age && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.age')}</span><span className="text-text-main">{selectedLead.age}</span></div>
                                    )}
                                    {selectedLead.gender && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.gender')}</span><span className="text-text-main">{selectedLead.gender}</span></div>
                                    )}
                                    {selectedLead.weight && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.weight')}</span><span className="text-text-main">{selectedLead.weight} kg</span></div>
                                    )}
                                    {selectedLead.height && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.height')}</span><span className="text-text-main">{selectedLead.height} cm</span></div>
                                    )}
                                    {selectedLead.goal && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.goal')}</span><span className="text-text-main">{selectedLead.goal}</span></div>
                                    )}
                                    {selectedLead.plan && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.plan')}</span><span className="text-text-main">{selectedLead.plan}</span></div>
                                    )}
                                    {selectedLead.experience_level && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.experience')}</span><span className="text-text-main">{selectedLead.experience_level}</span></div>
                                    )}
                                    {selectedLead.availability && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.availability')}</span><span className="text-text-main">{selectedLead.availability}</span></div>
                                    )}
                                    {selectedLead.medical_conditions && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.medical')}</span><span className="text-text-main text-right max-w-[200px]">{selectedLead.medical_conditions}</span></div>
                                    )}
                                    {selectedLead.contact_preference && (
                                        <div className="flex justify-between"><span className="text-text-muted">{t('leads.contactPref')}</span><span className="text-text-main">{selectedLead.contact_preference}</span></div>
                                    )}
                                </div>

                                {/* WhatsApp CTA */}
                                {selectedLead.phone && (
                                    <a
                                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${selectedLead.full_name}, gracias por tu interés en nuestro programa de entrenamiento. ¿Cuándo te gustaría empezar?`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
                                    >
                                        💬 {t('leads.contactWhatsApp')}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-surface-dark border border-border/10 p-8 text-center">
                                <Eye size={32} className="text-text-muted mx-auto mb-3" />
                                <p className="text-text-muted text-sm">{t('leads.selectLead')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadsPage;
