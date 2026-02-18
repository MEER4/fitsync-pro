import { useAssignments } from '../../hooks/useAssignments';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, Trophy, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const MemberHistoryPage = () => {
    const { assignments, isLoading } = useAssignments();
    const completedAssignments = assignments.filter(a => a.status === 'completed');

    if (isLoading) return <div className="p-8 text-center text-gray-400">Loading history...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Workout History</h1>
                <p className="text-gray-400">Your wall of fame. Every drop of sweat counts.</p>
            </div>

            <div className="grid gap-4">
                {completedAssignments.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-white/10 bg-transparent">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/5 mb-6">
                            <Trophy className="text-gray-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No completed workouts yet</h3>
                        <p className="text-gray-400">Complete your first assigned workout to see it here!</p>
                    </Card>
                ) : (
                    completedAssignments.map((assignment) => (
                        <Card key={assignment.id} className="p-6 bg-surface-dark border-white/5 hover:border-primary/20 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{assignment.routine.name}</h3>
                                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {assignment.completed_date && format(new Date(assignment.completed_date), 'PPP @ p')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {assignment.routine.estimated_duration_min} min (est.)
                                        </span>
                                    </div>
                                    {assignment.feedback_notes && (
                                        <div className="mt-4 p-3 bg-white/5 rounded-lg text-sm text-gray-300 flex items-start gap-2">
                                            <MessageSquare size={14} className="mt-0.5 text-primary shrink-0" />
                                            <p>"{assignment.feedback_notes}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Future: Show calculated stats or specific achievements here */}
                                <div className="text-right hidden md:block">
                                    <div className="text-2xl font-bold text-primary">
                                        {assignment.routine.items.length}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Exercises</div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberHistoryPage;
