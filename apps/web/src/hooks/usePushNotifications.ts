import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function usePushNotifications() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);

            // Check if already subscribed
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    setIsSubscribed(subscription !== null);
                });
            });
        }
    }, []);

    // Utility to convert base64 VAPID key to Uint8Array
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        if (!isSupported || !user) return;

        try {
            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult !== 'granted') {
                showToast('Notification permission denied', 'error');
                return;
            }

            const registration = await navigator.serviceWorker.register('/sw.js');

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session found.');

            // Send subscription to backend
            await axios.post(`${API_URL}/notifications/subscribe`, subscription, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            setIsSubscribed(true);
            showToast('Successfully subscribed to notifications!', 'success');

        } catch (error) {
            console.error('Failed to subscribe:', error);
            showToast('Failed to subscribe to notifications', 'error');
        }
    };

    return {
        isSupported,
        isSubscribed,
        permission,
        subscribe
    };
}
