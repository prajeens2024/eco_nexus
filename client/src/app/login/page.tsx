'use client';
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Zap,
    Cpu, Users, Warehouse, ChevronLeft, Loader2
} from 'lucide-react';

const demoAccounts = [
    { role: 'provider', email: 'provider@demo.com', label: 'Industry Provider', icon: Cpu, color: '#06d6a0' },
    { role: 'consumer', email: 'consumer@demo.com', label: 'Industry Consumer', icon: Users, color: '#4361ee' },
    { role: 'admin', email: 'admin@demo.com', label: 'Platform Admin', icon: Warehouse, color: '#7209b7' },
];

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (demoEmail: string) => {
        setError('');
        setLoading(true);
        try {
            await login(demoEmail, 'demo123456');
            router.push('/dashboard');
        } catch (err: any) {
            setError('Demo login failed. Make sure the backend is running with seed data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)] relative overflow-hidden">
            {/* ═══ Left Panel — Branding ═══ */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
                <div className="absolute inset-0 grid-bg-animated" />
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,214,160,0.06)] via-transparent to-[rgba(67,97,238,0.06)]" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.08),transparent_70%)]" style={{ animation: 'float-slow 20s ease-in-out infinite' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(67,97,238,0.08),transparent_70%)]" style={{ animation: 'float-slow 25s ease-in-out infinite reverse' }} />

                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-md px-12">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                        <span className="text-xl font-bold">ECONEXUS</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                        Transform idle industrial capacity into <span className="gradient-text">real revenue</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                        Join 500+ MSMEs sharing machinery, labor, and warehouses — powered by AI matching and secure escrow payments.
                    </p>

                    {/* Stats mini cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Resources Listed', value: '2,400+' },
                            { label: 'Monthly Savings', value: '₹18L avg' },
                            { label: 'Uptime SLA', value: '99.9%' },
                            { label: 'CO₂ Reduced', value: '12K tons' },
                        ].map((s, i) => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="glass-card p-3 text-center">
                                <div className="text-lg font-bold gradient-text">{s.value}</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ═══ Right Panel — Login Form ═══ */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
                <div className="absolute inset-0 bg-[var(--bg-secondary)] lg:bg-transparent" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md">

                    {/* Back link */}
                    <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-white transition mb-8 group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to home
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Sign in to your account to continue managing your resources
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-[rgba(247,37,133,0.08)] border border-[rgba(247,37,133,0.2)] text-sm text-[var(--accent-pink)]">
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    className="input-field pl-11" placeholder="you@company.com" required autoFocus />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-11" placeholder="Enter your password" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent accent-[var(--accent-cyan)]" />
                                Remember me
                            </label>
                            <span className="text-[var(--accent-cyan)] hover:underline cursor-pointer text-xs">Forgot password?</span>
                        </div>

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--glass-border)]" /></div>
                        <div className="relative flex justify-center"><span className="px-3 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] lg:bg-[var(--bg-primary)]">or try a demo account</span></div>
                    </div>

                    {/* Demo accounts */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {demoAccounts.map((demo) => (
                            <button key={demo.role} onClick={() => handleDemoLogin(demo.email)} disabled={loading}
                                className="glass-card glass-card-hover p-3 text-center group disabled:opacity-50">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110"
                                    style={{ background: `${demo.color}12` }}>
                                    <demo.icon size={16} style={{ color: demo.color }} />
                                </div>
                                <span className="text-[10px] font-medium text-[var(--text-secondary)] block leading-tight">{demo.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-[var(--text-secondary)]">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-[var(--accent-cyan)] hover:underline font-medium">Create one free</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
