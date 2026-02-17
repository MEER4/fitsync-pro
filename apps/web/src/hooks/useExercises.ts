import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Exercise {
    id: string;
    title: string;
    description?: string;
    video_url: string;
    thumbnail_url?: string;
}

export const useExercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await api.get('/exercises');
                setExercises(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch exercises');
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    return { exercises, loading, error };
};
