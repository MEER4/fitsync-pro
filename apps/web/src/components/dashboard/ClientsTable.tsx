import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MoreHorizontal } from 'lucide-react';

export const ClientsTable = () => {
    const clients = [
        { id: 1, name: "Sarah Connor", status: "Active", lastWorkout: "Leg Day (Yesterday)" },
        { id: 2, name: "John Wick", status: "Pending", lastWorkout: "Tactical Reload (2 days ago)" },
        { id: 3, name: "Ellen Ripley", status: "Active", lastWorkout: "Cardio (Today)" },
    ];

    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h3 className="font-display text-xl font-bold">Recent Athletes</h3>
            </div>
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-white font-display">
                    <tr>
                        <th className="px-6 py-4">Athlete</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Routine</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                            <td className="px-6 py-4">
                                <Badge variant={client.status === 'Active' ? 'gold' : 'gray'}>
                                    {client.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">{client.lastWorkout}</td>
                            <td className="px-6 py-4">
                                <Button variant="ghost" className="p-2 h-8 w-8">
                                    <MoreHorizontal size={16} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};
