import { Card } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    color?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, color = "text-primary" }: StatCardProps) => {
    return (
        <Card className="flex items-center gap-4 hover:border-primary/30 transition-colors">
            <div className={clsx("p-3 rounded-full bg-white/5", color)}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-display font-bold text-white mt-1">{value}</p>
                {trend && <span className="text-xs text-green-400">{trend}</span>}
            </div>
        </Card>
    );
};
