import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Save, Loader2, Camera, Lock, Eye, EyeOff, Moon, Sun, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { usePushNotifications } from '../hooks/usePushNotifications';

const SettingsPage = () => {
    const { profile, user, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { isSupported, isSubscribed, permission, subscribe } = usePushNotifications();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [weeklyGoal, setWeeklyGoal] = useState<number>(profile?.weekly_goal || 3);
    const [language, setLanguage] = useState(profile?.language_pref || 'en');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image must be less than 2MB', 'error');
            return;
        }

        setUploadingAvatar(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `avatars/${user.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
            setAvatarUrl(publicUrl);

            // Update profile with new avatar URL
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            await refreshProfile();
            showToast('Avatar updated!', 'success');
        } catch (error: any) {
            console.error('Avatar upload error:', error);
            showToast('Failed to upload avatar', 'error');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    language_pref: language,
                })
                .eq('id', user?.id);

            if (error) throw error;

            await i18n.changeLanguage(language);
            await refreshProfile();
            showToast(t('settings.profileUpdated'), 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            showToast('Password updated successfully!', 'success');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (error: any) {
            showToast(error.message || 'Failed to change password', 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('settings.title')}</h1>
                <p className="text-text-muted">{t('settings.subtitle')}</p>
            </div>

            <Card className="p-8 bg-surface-dark border-border/10 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main">{t('settings.profileInfo')}</h2>
                    </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/10">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden border-2 border-border/10">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                profile?.full_name?.[0] || user?.email?.[0] || 'U'
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        >
                            {uploadingAvatar ? (
                                <Loader2 size={20} className="text-white animate-spin" />
                            ) : (
                                <Camera size={20} className="text-white" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-text-main font-medium">{t('settings.profilePhoto')}</p>
                        <p className="text-xs text-text-muted mt-1">{t('settings.photoHint')}</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-primary hover:text-primary-focus mt-2 transition-colors"
                        >
                            {uploadingAvatar ? t('common.loading') : t('common.edit')}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.fullName')}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={t('settings.fullName')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-dark border border-border/10 text-text-muted cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.language')}</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.theme') || 'Theme'}</label>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                    {theme === 'dark' ? (t('settings.darkTheme') || 'Dark') : (t('settings.lightTheme') || 'Light')}
                                </span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.notifications') || 'Notificaciones Push'}</label>
                            <div className="p-4 rounded-lg bg-background-dark/5 border border-border/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className={isSubscribed ? "text-primary" : "text-text-muted"} size={20} />
                                        <div>
                                            <p className="text-text-main font-medium">{t('settings.pushNotifications') || 'Notificaciones'}</p>
                                            <p className="text-xs text-text-muted">
                                                {!isSupported ? (t('settings.pushNotSupported') || 'No soportado en este navegador') :
                                                    permission === 'denied' ? (t('settings.pushDenied') || 'Permiso denegado') :
                                                        isSubscribed ? (t('settings.pushActive') || 'Activas') :
                                                            (t('settings.pushInactive') || 'Inactivas')}
                                            </p>
                                        </div>
                                    </div>
                                    {isSupported && permission !== 'denied' && !isSubscribed && (
                                        <Button
                                            type="button"
                                            onClick={subscribe}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {t('settings.enablePush') || 'Activar'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {profile?.role === 'member' && (
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.weeklyGoal')}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">🎯</div>
                                    <input
                                        type="number"
                                        min="1"
                                        max="14"
                                        value={weeklyGoal}
                                        onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 3)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="3"
                                    />
                                </div>
                                <p className="text-xs text-text-muted mt-1">{t('settings.recommendedGoal')}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border/10">
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                            {t('settings.saveChanges')}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Security Section */}
            <Card className="p-8 bg-surface-dark border-border/10 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main">{t('settings.security')}</h2>
                        <p className="text-text-muted text-sm">{t('settings.subtitle')}</p>
                    </div>
                </div>

                {!showPasswordForm ? (
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordForm(true)}
                        className="gap-2"
                    >
                        <Lock size={16} />
                        {t('settings.changePassword')}
                    </Button>
                ) : (
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.newPassword')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Min 6"
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">{t('settings.confirmPassword')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background-dark/5 border border-border/10 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={t('settings.confirmPassword')}
                                    minLength={6}
                                    required
                                />
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{t('settings.passwordMismatch')}</p>
                            )}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={passwordLoading || newPassword !== confirmPassword}>
                                {passwordLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                                {t('settings.updatePassword')}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => { setShowPasswordForm(false); setNewPassword(''); setConfirmPassword(''); }}
                            >
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default SettingsPage;
