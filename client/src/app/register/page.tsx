'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Building2, ArrowRight, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'consumer' as const,
        company: '', phone: '', city: '', state: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                company: form.company,
                phone: form.phone,
                location: { type: 'Point', coordinates: [0, 0], address: '', city: form.city, state: form.state },
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(114,9,183,0.08),transparent_70%)]" />
                <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.08),transparent_70%)]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="glass-card p-8 md:p-10 w-full max-w-lg relative z-10">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Join the ECONEXUS industrial ecosystem</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">{error}</motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input name="name" value={form.name} onChange={handleChange} className="input-field pl-11" placeholder="Full name" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Company</label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input name="company" value={form.company} onChange={handleChange} className="input-field pl-11" placeholder="Company name" required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-11" placeholder="you@company.com" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field pl-11" placeholder="Min 6 characters" required minLength={6} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">Phone</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input name="phone" value={form.phone} onChange={handleChange} className="input-field pl-11" placeholder="+91-XXXXX" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">I am a</label>
                            <select name="role" value={form.role} onChange={handleChange}
                                className="input-field bg-[rgba(255,255,255,0.04)] cursor-pointer appearance-none">
                                <option value="consumer" className="bg-[#12121a]">Consumer</option>
                                <option value="provider" className="bg-[#12121a]">Provider</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">City</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input name="city" value={form.city} onChange={handleChange} className="input-field pl-11" placeholder="City" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">State</label>
                            <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--accent-cyan)] hover:underline font-medium">Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
}
