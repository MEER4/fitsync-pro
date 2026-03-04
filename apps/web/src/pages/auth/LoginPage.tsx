import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark relative overflow-hidden">
            {/* Nebula Background Effect */}
            <div className="absolute inset-0 bg-nebula-gradient opacity-20 pointer-events-none"></div>

            <Card className="w-full max-w-md p-8 bg-surface-light border-border/10 shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-xl relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <Dumbbell size={32} />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-primary mb-2">FitSync</h2>
                    <p className="text-text-muted">{t('auth.loginSubtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-pulse">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">{t('auth.email')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-border/10 text-text-main placeholder-text-muted/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="coach@fitsync.pro"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">{t('auth.password')}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-surface-dark border border-border/10 text-text-main placeholder-text-muted/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t('auth.signIn')}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-text-muted">
                        {t('auth.newCoach')}{' '}
                        <Link to="/auth/register" className="text-primary hover:text-text-main font-medium transition-colors">
                            {t('auth.requestAccess')}
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
