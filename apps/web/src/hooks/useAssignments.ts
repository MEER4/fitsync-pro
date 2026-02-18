import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export interface Assignment {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'missed';
    scheduled_date: string;
    completed_date?: string;
    feedback_notes?: string;
    routine: {
        id: string;
        name: string;
        estimated_duration_min: number;
        difficulty_level: string;
        items: any[];
    };
    coach: {
        full_name: string;
        avatar_url: string;
    };
}

export const useAssignments = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/assignments/my-assignments');
            setAssignments(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
            setError('Failed to load your workouts.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    return { assignments, isLoading, error, refetch: fetchAssignments };
};
