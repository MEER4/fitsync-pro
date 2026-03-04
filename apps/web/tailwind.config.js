/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                "background-dark": "rgb(var(--color-background-dark) / <alpha-value>)",
                "background-light": "rgb(var(--color-background-light) / <alpha-value>)",
                "surface-dark": "rgb(var(--color-surface-dark) / <alpha-value>)",
                "surface-light": "rgb(var(--color-surface-light) / <alpha-value>)",
                "text-main": "rgb(var(--color-text-main) / <alpha-value>)",
                "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
                "border": "rgb(var(--color-border) / <alpha-value>)",
            },
            fontFamily: {
                display: ['"Playfair Display"', "serif"],
                body: ['"Inter"', "sans-serif"],
            },
            backgroundImage: {
                'nebula-gradient': 'radial-gradient(circle at 50% 0%, rgba(88, 28, 135, 0.4) 0%, rgba(26, 11, 46, 0) 70%)',
                'card-glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }
        },
    },
    plugins: [],
}
