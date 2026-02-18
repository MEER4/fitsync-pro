import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export const useRoutineDraft = (form: UseFormReturn<any>) => {
    const STORAGE_KEY = 'routine_draft_v1';

    // Load draft on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                form.reset(parsed);
                console.log('Draft loaded from storage');
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }
    }, [form.reset]);

    // Save draft on change
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { clearDraft };
};
