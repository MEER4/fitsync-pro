/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#d4af37", // Gold
                secondary: "#e2b4bd", // Soft Rose
                "background-dark": "#1a0b2e", // Deep Purple
                "background-light": "#fdf2f4", // Rose White
                "surface-dark": "#25163a", // Surface Purple
                "surface-light": "rgba(255, 255, 255, 0.05)", // Glass effect
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
