'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { analyticsAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import {
    Package, ArrowLeftRight, TrendingUp, DollarSign,
    Leaf, BarChart3, Users, Recycle, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const fadeUp = (i: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } },
});

const COLORS = ['#06d6a0', '#4361ee', '#7209b7', '#f72585'];

function StatCard({ icon: Icon, label, value, sub, color, idx }: any) {
    return (
        <motion.div variants={fadeUp(idx)} initial="hidden" animate="visible"
            className="glass-card glass-card-hover p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{sub}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-sm text-[var(--text-secondary)]">{label}</div>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="glass-card p-5">
            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="skeleton w-20 h-7 mb-2" />
            <div className="skeleton w-28 h-4" />
        </div>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [utilization, setUtilization] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, utilRes, activityRes] = await Promise.all([
                    analyticsAPI.getDashboard(),
                    analyticsAPI.getUtilization(),
                    analyticsAPI.getRecentActivity(),
                ]);
                setStats(statsRes.data.data);
                setUtilization(utilRes.data.data);
                setRecentActivity(activityRes.data.data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-6"><div className="skeleton w-full h-64 rounded-xl" /></div>
                    <div className="glass-card p-6"><div className="skeleton w-full h-64 rounded-xl" /></div>
                </div>
            </div>
        );
    }

    const statCards = [
        { icon: Package, label: 'Total Resources', value: stats?.totalResources || 0, sub: `${stats?.activeResources || 0} active`, color: '#06d6a0' },
        { icon: ArrowLeftRight, label: 'Transactions', value: stats?.totalTransactions || 0, sub: `${stats?.completedTransactions || 0} completed`, color: '#4361ee' },
        { icon: DollarSign, label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`, sub: `Avg ₹${stats?.avgTransactionValue || 0}`, color: '#7209b7' },
        { icon: TrendingUp, label: 'Utilization Rate', value: `${stats?.utilizationRate || 0}%`, sub: `${stats?.idleResources || 0} idle`, color: '#f72585' },
    ];

    if (user?.role === 'admin') {
        statCards.push(
            { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, sub: 'across all roles', color: '#fb8500' },
            { icon: Recycle, label: 'Scrap Listings', value: stats?.totalScrapListings || 0, sub: 'marketplace', color: '#06d6a0' }
        );
    }

    // Mock chart data
    const areaData = Array.from({ length: 14 }, (_, i) => ({
        name: `Day ${i + 1}`,
        revenue: Math.floor(Math.random() * 50000 + 20000),
        bookings: Math.floor(Math.random() * 10 + 2),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Here&apos;s what&apos;s happening with your {user?.role === 'admin' ? 'platform' : 'resources'} today.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} idx={i} />
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-[var(--accent-cyan)]" /> Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#06d6a0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#06d6a0" fill="url(#areaGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity size={18} className="text-[var(--accent-blue)]" /> Resource Utilization</h3>
                    {utilization.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={utilization}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="type" tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                                <Bar dataKey="active" fill="#06d6a0" radius={[6, 6, 0, 0]} name="Active" />
                                <Bar dataKey="booked" fill="#4361ee" radius={[6, 6, 0, 0]} name="Booked" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">No utilization data yet</div>
                    )}
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity size={18} className="text-[var(--accent-purple)]" /> Recent Activity</h3>
                {recentActivity.length > 0 ? (
                    <div className="space-y-3">
                        {recentActivity.slice(0, 5).map((txn: any) => (
                            <div key={txn._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ background: `${COLORS[Math.floor(Math.random() * 4)]}15` }}>
                                        <ArrowLeftRight size={16} className="text-[var(--accent-cyan)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{typeof txn.resource === 'object' ? txn.resource.title : 'Resource'}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{typeof txn.consumer === 'object' ? txn.consumer.name : ''} → {typeof txn.provider === 'object' ? txn.provider.name : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium status-${txn.status?.replace('_', '-') || 'active'}`}>
                                        {txn.status?.replace(/_/g, ' ')}
                                    </span>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">₹{txn.amount?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        <Leaf size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
