import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-white p-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-6 animate-fade-in">
                FitSync Pro
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-2xl text-center">
                Elevate your fitness journey with cosmic precision.
                <br />
                <span className="text-sm opacity-70">Premium Coaching & Analytics Platform</span>
            </p>

            <div className="flex gap-4">
                <Link
                    to="/auth"
                    className="px-8 py-3 bg-primary text-background-dark font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
                >
                    Get Started
                </Link>
                <Link
                    to="/dashboard"
                    className="px-8 py-3 border border-secondary text-secondary font-bold rounded-full hover:bg-secondary hover:text-background-dark transition-all duration-300"
                >
                    Demo Dashboard
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
