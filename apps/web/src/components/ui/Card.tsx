import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div
            className={twMerge(clsx(
                "bg-surface-dark border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-md",
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
};
