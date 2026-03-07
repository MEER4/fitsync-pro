import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, MoreVertical, Dumbbell, Utensils, UserPlus, Copy, X, Eye, Trash2, Check } from 'lucide-react';
import api from '../../lib/api';
import { AssignRoutineModal } from '../../components/coach/AssignRoutineModal';
import { useToast } from '../../context/ToastContext';

interface Member {
    id: string;
    full_name: string;
    email: string;
    last_active?: string;
    avatar_url?: string;
}

const MembersPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // Dropdown State
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Invite Modal
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/users/members');
            setMembers(response.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAssignModal = (member: Member) => {
        setSelectedMember(member);
        setIsAssignModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleRemoveMember = async (member: Member) => {
        setOpenDropdownId(null);
        if (!confirm(t('members.removeConfirm', { name: member.full_name || member.email }))) return;
        try {
            await api.delete(`/users/members/${member.id}`);
            setMembers(prev => prev.filter(m => m.id !== member.id));
            showToast(t('members.removeSuccess'), 'success');
        } catch {
            showToast(t('members.removeError'), 'error');
        }
    };

    const handleCopyInviteLink = async () => {
        const inviteLink = `${window.location.origin}/auth/register`;
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            showToast(t('members.linkCopied'), 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast(t('members.linkError'), 'error');
        }
    };

    const filteredMembers = members.filter(member =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('members.title')}</h1>
                    <p className="text-text-muted">{t('members.subtitle')}</p>
                </div>
                <Button onClick={() => setIsInviteModalOpen(true)} className="gap-2">
                    <UserPlus size={18} />
                    {t('members.inviteMember')}
                </Button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4 bg-surface-dark/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder={t('members.searchPlaceholder')}
                        className="w-full bg-background-dark border border-border/10 rounded-lg pl-10 pr-4 py-2 text-text-main focus:outline-none focus:border-primary/50 placeholder:text-text-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Members List */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-10 text-text-muted">{t('members.loading')}</div>
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-10 text-text-muted">
                        {searchTerm ? t('members.noMembersFound') : (
                            <div className="space-y-4">
                                <p>{t('members.noMembersYet')}</p>
                                <Button onClick={() => setIsInviteModalOpen(true)} variant="outline" className="gap-2">
                                    <UserPlus size={16} />
                                    {t('members.inviteFirst')}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    filteredMembers.map(member => (
                        <Card key={member.id} className={`p-4 md:p-6 bg-surface-dark border-border/10 hover:border-primary/20 transition-all ${openDropdownId === member.id ? 'relative z-50' : 'relative z-10'}`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                        {member.avatar_url ? (
                                            <img src={member.avatar_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            member.full_name?.[0] || member.email[0]
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-text-main text-lg truncate">{member.full_name || t('members.unnamedMember')}</h3>
                                        <p className="text-sm text-text-muted truncate">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-stretch gap-3 w-full md:w-auto">
                                    <div className="flex-1 grid grid-cols-2 gap-3 md:flex md:flex-none">
                                        <Button
                                            variant="outline"
                                            className="gap-2 py-2 px-2 text-sm h-full w-full justify-center"
                                            onClick={() => handleOpenAssignModal(member)}
                                        >
                                            <Dumbbell size={16} className="shrink-0 md:inline-block hidden lg:inline-block" />
                                            <span className="text-center">{t('members.assignRoutine')}</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="gap-2 py-2 px-2 text-sm h-full w-full justify-center"
                                            onClick={() => navigate(`/dashboard/members/${member.id}/diet`)}
                                        >
                                            <Utensils size={16} className="shrink-0 md:inline-block hidden lg:inline-block" />
                                            <span className="text-center">{t('members.diet')}</span>
                                        </Button>
                                    </div>

                                    {/* Dropdown Menu */}
                                    <div className="relative" ref={openDropdownId === member.id ? dropdownRef : null}>
                                        <button
                                            onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                            className="text-text-muted hover:text-text-main p-2 rounded-lg hover:bg-text-main/5 transition-colors"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {openDropdownId === member.id && (
                                            <div className="absolute right-0 top-full mt-1 w-52 bg-surface-dark border border-border/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-slide-up">
                                                <button
                                                    onClick={() => { setOpenDropdownId(null); navigate(`/dashboard/members/${member.id}`); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-main hover:bg-text-main/5 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    {t('members.viewProfile')}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenAssignModal(member)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-main hover:bg-text-main/5 transition-colors"
                                                >
                                                    <Dumbbell size={16} />
                                                    {t('members.assignRoutine')}
                                                </button>
                                                <button
                                                    onClick={() => { setOpenDropdownId(null); navigate(`/dashboard/members/${member.id}/diet`); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-main hover:bg-text-main/5 transition-colors"
                                                >
                                                    <Utensils size={16} />
                                                    {t('members.dietPlan')}
                                                </button>
                                                <div className="h-px bg-border/20 mx-3" />
                                                <button
                                                    onClick={() => handleRemoveMember(member)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    {t('members.removeMember')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Assign Routine Modal */}
            {selectedMember && (
                <AssignRoutineModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    memberId={selectedMember.id}
                    memberName={selectedMember.full_name || selectedMember.email}
                    onSuccess={() => {
                        showToast(t('members.assignSuccess'), 'success');
                    }}
                />
            )}

            {/* Invite Member Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)} />
                    <div className="relative bg-surface-dark border border-border/10 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-black/50 animate-slide-up">
                        <button
                            onClick={() => setIsInviteModalOpen(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-2 mb-8">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="text-primary" size={28} />
                            </div>
                            <h2 className="text-xl font-display font-bold text-text-main">{t('members.inviteTitle')}</h2>
                            <p className="text-text-muted text-sm">{t('members.inviteSubtitle')}</p>
                        </div>

                        {/* Invite Link */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-text-main/5 border border-border/10 rounded-lg px-4 py-3 text-sm text-text-main truncate">
                                    {window.location.origin}/auth/register
                                </div>
                                <button
                                    onClick={handleCopyInviteLink}
                                    className={`shrink-0 p-3 rounded-lg border transition-all duration-300 ${copied
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                        : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                                        }`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>

                            {/* WhatsApp Share */}
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`${t('members.inviteSubtitle')} ${window.location.origin}/auth/register`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/30 transition-colors font-medium text-sm"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                {t('members.sendWhatsapp')}
                            </a>

                            <p className="text-xs text-text-muted text-center pt-2">
                                {t('members.inviteNote')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembersPage;
