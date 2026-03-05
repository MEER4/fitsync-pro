import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MoreHorizontal } from 'lucide-react';
import api from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Activity {
    id: string;
    athleteName: string;
    athleteAvatar?: string;
    status: string;
    routineName: string;
    date: string;
}

export const ClientsTable = () => {
    const { t, i18n } = useTranslation();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const dateLocale = i18n.language === 'es' ? es : enUS;

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await api.get('/dashboard/recent-activity');
                setActivities(res.data);
            } catch (error) {
                console.error("Failed to fetch recent activity", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'completed': t('dashboard.statusCompleted'),
            'in_progress': t('dashboard.statusInProgress'),
            'pending': t('dashboard.statusPending'),
        };
        return statusMap[status] || status.replace('_', ' ');
    };

    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h3 className="font-display text-xl font-bold">{t('dashboard.recentActivity')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-white font-display">
                        <tr>
                            <th className="px-6 py-4">{t('dashboard.athlete')}</th>
                            <th className="px-6 py-4">{t('dashboard.status')}</th>
                            <th className="px-6 py-4">{t('dashboard.routine')}</th>
                            <th className="px-6 py-4">{t('dashboard.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">{t('dashboard.loadingActivity')}</td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">{t('dashboard.noActivity')}</td>
                            </tr>
                        ) : (
                            activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                            {activity.athleteAvatar ? (
                                                <img src={activity.athleteAvatar} alt={activity.athleteName} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                activity.athleteName[0]
                                            )}
                                        </div>
                                        {activity.athleteName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            activity.status === 'completed' ? 'gold' :
                                                activity.status === 'in_progress' ? 'blue' : 'gray'
                                        }>
                                            {getStatusLabel(activity.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white">{activity.routineName}</span>
                                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: dateLocale })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button variant="ghost" className="p-2 h-8 w-8">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
