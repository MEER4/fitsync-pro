import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'gold' | 'gray' | 'success' | 'blue';
}

export const Badge = ({ children, variant = 'gray' }: BadgeProps) => {
    const variants = {
        gold: "bg-primary/10 text-primary border-primary/20",
        gray: "bg-white/5 text-gray-400 border-white/10",
        success: "bg-green-500/10 text-green-400 border-green-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };

    return (
        <span className={twMerge(clsx(
            "px-3 py-1 rounded-full text-xs font-semibold border",
            variants[variant]
        ))}>
            {children}
        </span>
    );
};
