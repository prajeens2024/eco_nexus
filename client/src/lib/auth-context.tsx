'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('econexus_token');
        const savedUser = localStorage.getItem('econexus_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authAPI.login({ email, password });
        const { user: userData, token: newToken } = res.data.data;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('econexus_token', newToken);
        localStorage.setItem('econexus_user', JSON.stringify(userData));
    };

    const register = async (data: any) => {
        const res = await authAPI.register(data);
        const { user: userData, token: newToken } = res.data.data;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('econexus_token', newToken);
        localStorage.setItem('econexus_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('econexus_token');
        localStorage.removeItem('econexus_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
