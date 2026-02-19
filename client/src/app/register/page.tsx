'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Lock, Building2, MapPin, Eye, EyeOff,
    ArrowRight, ArrowLeft, ChevronLeft, Loader2,
    Cpu, Users, ShieldCheck, CheckCircle2
} from 'lucide-react';

const roles = [
    { value: 'provider', label: 'Industry Provider', desc: 'List and share your idle resources', icon: Cpu, color: '#06d6a0' },
    { value: 'consumer', label: 'Industry Consumer', desc: 'Find and book resources you need', icon: Users, color: '#4361ee' },
];

const benefits = [
    'AI-powered resource matching',
    'Secure escrow payments',
    'Real-time analytics dashboard',
    'Predictive demand forecasting',
    'Verified industry partners',
    'Dedicated support team',
];

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        role: 'provider', company: '', city: '', state: '',
    });

    const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const validateStep1 = () => {
        if (!form.name || !form.email || !form.password) return 'Please fill all required fields';
        if (form.password.length < 8) return 'Password must be at least 8 characters';
        if (form.password !== form.confirmPassword) return 'Passwords do not match';
        return null;
    };

    const handleNext = () => {
        const err = validateStep1();
        if (err) { setError(err); return; }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register({
                name: form.name, email: form.email, password: form.password,
                role: form.role, company: form.company,
                location: { city: form.city, state: form.state },
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)] relative overflow-hidden">
            {/* ═══ Left Panel — Branding ═══ */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
                <div className="absolute inset-0 grid-bg-animated" />
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(67,97,238,0.06)] via-transparent to-[rgba(114,9,183,0.06)]" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(67,97,238,0.08),transparent_70%)]" style={{ animation: 'float-slow 20s ease-in-out infinite' }} />

                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-md px-12">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                        <span className="text-xl font-bold">ECONEXUS</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                        Join India&apos;s <span className="gradient-text-blue">largest</span> industrial resource sharing platform
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                        Create your free account and start optimizing your resource utilization in under 5 minutes.
                    </p>

                    <div className="space-y-3">
                        {benefits.map((b, i) => (
                            <motion.div key={b} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <CheckCircle2 size={16} className="text-[var(--accent-cyan)] shrink-0" />
                                {b}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ═══ Right Panel — Registration Form ═══ */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
                <div className="absolute inset-0 bg-[var(--bg-secondary)] lg:bg-transparent" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md">

                    <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-white transition mb-8 group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to home
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {step === 1 ? 'Start with your personal details' : 'Tell us about your business'}
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-6">
                        {[1, 2].map(s => (
                            <div key={s} className="flex items-center gap-2 flex-1">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-[var(--accent-cyan)] text-white' : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]'}`}>
                                    {step > s ? <CheckCircle2 size={14} /> : s}
                                </div>
                                <span className={`text-xs font-medium ${step >= s ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                                    {s === 1 ? 'Account' : 'Business'}
                                </span>
                                {s < 2 && <div className={`flex-1 h-[2px] rounded transition-colors ${step > 1 ? 'bg-[var(--accent-cyan)]' : 'bg-[rgba(255,255,255,0.05)]'}`} />}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-[rgba(247,37,133,0.08)] border border-[rgba(247,37,133,0.2)] text-sm text-[var(--accent-pink)]">
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)}
                                                className="input-field pl-11" placeholder="Rajesh Kumar" required autoFocus />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)}
                                                className="input-field pl-11" placeholder="rajesh@company.com" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => updateForm('password', e.target.value)}
                                                className="input-field pl-11 pr-11" placeholder="Min. 8 characters" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Confirm Password</label>
                                        <div className="relative">
                                            <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input type="password" value={form.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)}
                                                className="input-field pl-11" placeholder="Repeat your password" required />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleNext} className="btn-primary w-full justify-center py-3 text-sm">
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4">
                                    {/* Role selection */}
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Your Role</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {roles.map(r => (
                                                <button key={r.value} type="button" onClick={() => updateForm('role', r.value)}
                                                    className={`glass-card p-4 text-left transition-all ${form.role === r.value ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan-dim)]' : 'hover:border-[var(--glass-border-hover)]'}`}>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${r.color}12` }}>
                                                        <r.icon size={16} style={{ color: r.color }} />
                                                    </div>
                                                    <p className="text-sm font-medium">{r.label}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)]">{r.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Company Name</label>
                                        <div className="relative">
                                            <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                            <input type="text" value={form.company} onChange={e => updateForm('company', e.target.value)}
                                                className="input-field pl-11" placeholder="Kumar Precision Pvt Ltd" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">City</label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                                <input type="text" value={form.city} onChange={e => updateForm('city', e.target.value)}
                                                    className="input-field pl-11" placeholder="Mumbai" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">State</label>
                                            <input type="text" value={form.state} onChange={e => updateForm('state', e.target.value)}
                                                className="input-field" placeholder="Maharashtra" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3 text-sm">
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-60">
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--accent-cyan)] hover:underline font-medium">Sign in</Link>
                    </p>

                    <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
