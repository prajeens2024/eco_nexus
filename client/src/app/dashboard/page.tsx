'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { analyticsAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import {
    Package, ArrowLeftRight, TrendingUp, DollarSign,
    Leaf, BarChart3, Users, Recycle, Activity,
    ArrowUpRight, ArrowDownRight, Clock, Zap
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from 'recharts';

const fadeIn = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.4 } },
});

const COLORS = ['#06d6a0', '#4361ee', '#7209b7', '#f72585'];

function StatCard({ icon: Icon, label, value, sub, change, color, idx }: any) {
    const isPositive = change > 0;
    return (
        <motion.div variants={fadeIn(idx * 0.06)} initial="hidden" animate="visible"
            className="glass-card glass-card-hover p-5 relative overflow-hidden group">
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${color}12` }}>
                    <Icon size={20} style={{ color }} />
                </div>
                {change !== undefined && (
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg ${isPositive ? 'text-[#06d6a0] bg-[rgba(6,214,160,0.1)]' : 'text-[#f72585] bg-[rgba(247,37,133,0.1)]'}`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold mb-0.5">{value}</div>
            <div className="text-sm text-[var(--text-secondary)]">{label}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{sub}</div>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="glass-card p-5">
            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="skeleton w-20 h-7 mb-2" />
            <div className="skeleton w-28 h-4 mb-1" />
            <div className="skeleton w-20 h-3" />
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card p-3 text-sm border border-[var(--glass-border)]">
            <p className="text-[var(--text-muted)] text-xs mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} className="font-medium" style={{ color: p.color }}>
                    {p.name}: {typeof p.value === 'number' ? `₹${p.value.toLocaleString()}` : p.value}
                </p>
            ))}
        </div>
    );
};

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
                    <div className="glass-card p-6"><div className="skeleton w-full h-72 rounded-xl" /></div>
                    <div className="glass-card p-6"><div className="skeleton w-full h-72 rounded-xl" /></div>
                </div>
            </div>
        );
    }

    const statCards = [
        { icon: Package, label: 'Total Resources', value: stats?.totalResources || 0, sub: `${stats?.activeResources || 0} active`, change: 12, color: '#06d6a0' },
        { icon: ArrowLeftRight, label: 'Transactions', value: stats?.totalTransactions || 0, sub: `${stats?.completedTransactions || 0} completed`, change: 8, color: '#4361ee' },
        { icon: DollarSign, label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`, sub: `Avg ₹${stats?.avgTransactionValue || 0}`, change: 24, color: '#7209b7' },
        { icon: TrendingUp, label: 'Utilization Rate', value: `${stats?.utilizationRate || 0}%`, sub: `${stats?.idleResources || 0} idle`, change: -3, color: '#f72585' },
    ];

    if (user?.role === 'admin') {
        statCards.push(
            { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, sub: 'across all roles', change: 15, color: '#fb8500' },
            { icon: Recycle, label: 'Scrap Listings', value: stats?.totalScrapListings || 0, sub: 'marketplace', change: 6, color: '#06d6a0' }
        );
    }

    // Mock chart data with realistic patterns
    const areaData = Array.from({ length: 14 }, (_, i) => ({
        name: `Day ${i + 1}`,
        revenue: Math.floor(Math.random() * 30000 + 25000 + i * 2000),
        bookings: Math.floor(Math.random() * 8 + 3 + i * 0.5),
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">
                        Welcome back, {user?.name?.split(' ')[0]} <span className="inline-block animate-[float_3s_ease-in-out_infinite]">👋</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Here&apos;s what&apos;s happening with your {user?.role === 'admin' ? 'platform' : 'resources'} today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Clock size={12} />
                    <span>Last updated: just now</span>
                    <span className="relative flex h-2 w-2 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]" />
                    </span>
                </div>
            </div>

            {/* Stat cards */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} idx={i} />
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold flex items-center gap-2">
                            <BarChart3 size={16} className="text-[var(--accent-cyan)]" /> Revenue Trend
                        </h3>
                        <span className="text-xs text-[var(--text-muted)] bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-lg">Last 14 days</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#06d6a0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" tick={{ fill: '#4e4e66', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#4e4e66', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#06d6a0" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold flex items-center gap-2">
                            <Activity size={16} className="text-[var(--accent-blue)]" /> Resource Utilization
                        </h3>
                        <span className="text-xs text-[var(--text-muted)] bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-lg">By type</span>
                    </div>
                    {utilization.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={utilization}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="type" tick={{ fill: '#4e4e66', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#4e4e66', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="active" fill="#06d6a0" radius={[6, 6, 0, 0]} name="Active" />
                                <Bar dataKey="booked" fill="#4361ee" radius={[6, 6, 0, 0]} name="Booked" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
                            <Zap size={32} className="mb-2 opacity-30" />
                            <p className="text-sm">No utilization data yet</p>
                            <p className="text-xs mt-1">Data appears when resources are listed</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <Activity size={16} className="text-[var(--accent-purple)]" /> Recent Activity
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">{recentActivity.length} transactions</span>
                </div>
                {recentActivity.length > 0 ? (
                    <div className="space-y-2">
                        {recentActivity.slice(0, 6).map((txn: any, i: number) => (
                            <motion.div key={txn._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.02)] transition group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS[i % 4]}12` }}>
                                        <ArrowLeftRight size={16} style={{ color: COLORS[i % 4] }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{typeof txn.resource === 'object' ? txn.resource.title : 'Resource'}</p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {typeof txn.consumer === 'object' ? txn.consumer.name : ''} → {typeof txn.provider === 'object' ? txn.provider.name : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium status-${txn.status?.replace('_', '-') || 'active'}`}>
                                        {txn.status?.replace(/_/g, ' ')}
                                    </span>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">₹{txn.amount?.toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-[var(--text-muted)]">
                        <Leaf size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No recent activity</p>
                        <p className="text-xs mt-1">Transactions will appear here once resources are booked</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
