import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SettingsPage = () => {
    const { profile, user, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user?.id);

            if (error) throw error;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account and preferences.</p>
            </div>

            <Card className="p-8 bg-surface-light border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Public Profile</h2>
                        <p className="text-gray-400 text-sm">Update your personal information.</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-dark border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-dark/50 border border-white/5 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="p-8 bg-surface-light border-white/5 opacity-70">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Security</h2>
                        <p className="text-gray-400 text-sm">Password and authentication (Coming Soon).</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button variant="outline" disabled className="w-full md:w-auto opacity-50 cursor-not-allowed">
                        Change Password
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
