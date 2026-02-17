import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-background-dark hover:bg-yellow-500",
        outline: "border border-secondary text-secondary hover:bg-secondary hover:text-background-dark",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <button
            className={twMerge(clsx(
                "px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                className
            ))}
            {...props}
        >
            {children}
        </button>
    );
};
