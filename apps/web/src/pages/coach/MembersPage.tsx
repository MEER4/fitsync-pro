import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, MoreVertical, Dumbbell } from 'lucide-react';
import api from '../../lib/api';
import { AssignRoutineModal } from '../../components/coach/AssignRoutineModal';

interface Member {
    id: string;
    full_name: string;
    email: string;
    last_active?: string;
    avatar_url?: string;
}

const MembersPage = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    useEffect(() => {
        fetchMembers();
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
    };

    const filteredMembers = members.filter(member =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Members</h1>
                    <p className="text-gray-400">Manage your athletes and assign workouts.</p>
                </div>
                <Button>
                    Invite Member
                </Button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4 bg-surface-dark/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full bg-background-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Members List */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading members...</div>
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No members found.</div>
                ) : (
                    filteredMembers.map(member => (
                        <Card key={member.id} className="p-4 md:p-6 bg-surface-dark border-white/5 hover:border-primary/20 transition-all">
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
                                        <h3 className="font-bold text-white text-lg truncate">{member.full_name || 'Unnamed Member'}</h3>
                                        <p className="text-sm text-gray-400 truncate">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button
                                        variant="outline"
                                        className="gap-2 py-2 px-4 text-sm flex-1 md:flex-none justify-center"
                                        onClick={() => handleOpenAssignModal(member)}
                                    >
                                        <Dumbbell size={16} />
                                        Assign Routine
                                    </Button>
                                    <button className="text-gray-400 hover:text-white p-2">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Modals */}
            {selectedMember && (
                <AssignRoutineModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    memberId={selectedMember.id}
                    memberName={selectedMember.full_name || selectedMember.email}
                    onSuccess={() => {
                        // Optional: Show success toast
                        console.log('Assignment successful');
                    }}
                />
            )}
        </div>
    );
};

export default MembersPage;
