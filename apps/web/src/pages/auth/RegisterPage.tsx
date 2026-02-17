import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); // New success state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'coach', // Hardcoded for initial prototype
                    },
                },
            });

            if (error) throw error;
            setSuccess(true); // Show success message
            // For now, redirect to login or dashboard. 
            // Often signUp requires email verification, so let's show an alert or redirect.
            // If email auto-confirms or is unnecessary for dev:
            // navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-nebula-gradient opacity-20 pointer-events-none"></div>
                <Card className="w-full max-w-md p-8 bg-surface-light border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-xl relative z-10 animate-fade-in text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Check Your Email</h2>
                    <p className="text-gray-300 mb-8">
                        We've sent a confirmation link to <span className="text-primary">{email}</span>.
                        Please click the link to activate your account and enter the portal.
                    </p>
                    <Link to="/auth/login">
                        <Button variant="outline" className="w-full">
                            Return to Login
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-nebula-gradient opacity-20 pointer-events-none"></div>

            <Card className="w-full max-w-md p-8 bg-surface-light border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-xl relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">Join FitSync</h2>
                    <p className="text-gray-400">Begin your legacy.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-pulse">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="coach@fitsync.pro"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        className="w-full py-4 text-lg font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Already have access?{' '}
                        <Link to="/auth/login" className="text-primary hover:text-white font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;
