'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { authAPI, analyticsAPI } from '@/lib/api';
import { User } from '@/types';
import { Users, Shield, Search, ChevronDown, Activity, Database, Cpu } from 'lucide-react';

export default function AdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') return;
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    authAPI.getUsers({ role: roleFilter || undefined }),
                    analyticsAPI.getDashboard(),
                ]);
                setUsers(usersRes.data.data);
                setStats(statsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, roleFilter]);

    if (user?.role !== 'admin') {
        return (
            <div className="glass-card p-12 text-center">
                <Shield size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-sm text-[var(--text-secondary)]">Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-[var(--text-secondary)]">Platform management and monitoring</p>
            </div>

            {/* System Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#4361ee' },
                        { icon: Database, label: 'Resources', value: stats.totalResources, color: '#06d6a0' },
                        { icon: Activity, label: 'Transactions', value: stats.totalTransactions, color: '#7209b7' },
                        { icon: Cpu, label: 'Utilization', value: `${stats.utilizationRate}%`, color: '#f72585' },
                    ].map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="glass-card p-5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}15` }}>
                                <item.icon size={20} style={{ color: item.color }} />
                            </div>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{item.label}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* User Management */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <div className="relative">
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                            className="input-field appearance-none pr-10 cursor-pointer min-w-[140px] text-sm bg-[rgba(255,255,255,0.04)]">
                            <option value="" className="bg-[#12121a]">All Roles</option>
                            <option value="provider" className="bg-[#12121a]">Providers</option>
                            <option value="consumer" className="bg-[#12121a]">Consumers</option>
                            <option value="admin" className="bg-[#12121a]">Admins</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <div key={i} className="skeleton w-full h-14 rounded-xl" />)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[var(--text-muted)] border-b border-[var(--glass-border)]">
                                    <th className="pb-3 pr-4">User</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Role</th>
                                    <th className="pb-3 pr-4">Company</th>
                                    <th className="pb-3 pr-4">Reputation</th>
                                    <th className="pb-3">Transactions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                        className="border-b border-[var(--glass-border)] hover:bg-white/3 transition">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span className="font-medium">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-[var(--text-secondary)]">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${u.role === 'admin' ? 'text-[var(--accent-pink)] bg-[var(--accent-pink)]/10' : u.role === 'provider' ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10' : 'text-[var(--accent-blue)] bg-[var(--accent-blue)]/10'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-[var(--text-secondary)]">{u.company}</td>
                                        <td className="py-3 pr-4">{u.reputation.toFixed(1)}</td>
                                        <td className="py-3">{u.totalTransactions}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
