import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark">
            <div className="w-full max-w-md p-8 rounded-2xl bg-card-glass border border-white/10 shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-display font-bold text-primary mb-6 text-center">Welcome Back</h2>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="athlete@fitsync.pro"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full py-3 bg-gradient-to-r from-primary to-yellow-600 text-background-dark font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/" className="text-secondary hover:text-white transition-colors">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
