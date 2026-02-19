'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.08),transparent_70%)]" />
                <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(67,97,238,0.08),transparent_70%)]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="glass-card p-8 md:p-10 w-full max-w-md relative z-10">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Sign in to your ECONEXUS account</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-11" placeholder="you@company.com" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-11 pr-11" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Sign In <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-[var(--accent-cyan)] hover:underline font-medium">Sign up</Link>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--text-muted)] text-center mb-3">Quick access (demo)</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <button onClick={() => { setEmail('admin@econexus.in'); setPassword('admin123'); }} className="btn-secondary py-2 px-2 text-center">Admin</button>
                        <button onClick={() => { setEmail('rajesh@tatasteels.in'); setPassword('password123'); }} className="btn-secondary py-2 px-2 text-center">Provider</button>
                        <button onClick={() => { setEmail('suresh@consumer1.in'); setPassword('password123'); }} className="btn-secondary py-2 px-2 text-center">Consumer</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
