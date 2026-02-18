import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
        config.headers.Authorization = `Bearer ${data.session.access_token}`;
        console.log('API Request - Token attached:', data.session.access_token.substring(0, 10) + '...');
    } else {
        console.warn('API Request - No session/token found!');
    }
    return config;
});

export default api;
