import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('econexus_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('econexus_token');
            localStorage.removeItem('econexus_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
    getUsers: (params?: any) => api.get('/auth/users', { params }),
};

// Resources
export const resourceAPI = {
    getAll: (params?: any) => api.get('/resources', { params }),
    getById: (id: string) => api.get(`/resources/${id}`),
    create: (data: any) => api.post('/resources', data),
    update: (id: string, data: any) => api.put(`/resources/${id}`, data),
    delete: (id: string) => api.delete(`/resources/${id}`),
    getMy: () => api.get('/resources/my'),
    getNearby: (params: any) => api.get('/resources/nearby', { params }),
};

// Transactions
export const transactionAPI = {
    getAll: (params?: any) => api.get('/transactions', { params }),
    getById: (id: string) => api.get(`/transactions/${id}`),
    create: (data: any) => api.post('/transactions', data),
    approve: (id: string) => api.put(`/transactions/${id}/approve`),
    lockPayment: (id: string) => api.put(`/transactions/${id}/lock-payment`),
    complete: (id: string) => api.put(`/transactions/${id}/complete`),
    release: (id: string, data?: any) => api.put(`/transactions/${id}/release`, data),
    dispute: (id: string, data: { reason: string }) => api.put(`/transactions/${id}/dispute`, data),
};

// Scrap
export const scrapAPI = {
    getAll: (params?: any) => api.get('/scrap', { params }),
    getById: (id: string) => api.get(`/scrap/${id}`),
    create: (data: any) => api.post('/scrap', data),
    update: (id: string, data: any) => api.put(`/scrap/${id}`, data),
    delete: (id: string) => api.delete(`/scrap/${id}`),
    getMarketRates: () => api.get('/scrap/market-rates'),
    getTrends: () => api.get('/scrap/trends'),
};

// Analytics
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getUtilization: () => api.get('/analytics/utilization'),
    getRevenue: (params?: any) => api.get('/analytics/revenue', { params }),
    getEnvironmental: () => api.get('/analytics/environmental'),
    getTopPerformers: () => api.get('/analytics/top-performers'),
    getRecentActivity: () => api.get('/analytics/recent-activity'),
    getRecommendations: (params?: any) => api.get('/analytics/recommendations', { params }),
    getPredictions: (params: any) => api.get('/analytics/predictions', { params }),
};

export default api;
