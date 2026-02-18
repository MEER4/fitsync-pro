import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-background-dark hover:bg-yellow-500",
        outline: "border border-secondary text-secondary hover:bg-secondary hover:text-background-dark",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
        icon: "p-2 aspect-square"
    };

    return (
        <button
            className={twMerge(clsx(
                "rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            ))}
            {...props}
        >
            {children}
        </button>
    );
};
