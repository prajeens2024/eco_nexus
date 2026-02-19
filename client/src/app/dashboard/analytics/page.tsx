'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI } from '@/lib/api';
import {
    BarChart3, Leaf, TrendingUp, Users, Zap, TreePine
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#06d6a0', '#4361ee', '#7209b7', '#f72585', '#fb8500'];

export default function AnalyticsPage() {
    const [utilization, setUtilization] = useState<any[]>([]);
    const [environmental, setEnvironmental] = useState<any>(null);
    const [topPerformers, setTopPerformers] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [utilRes, envRes, topRes, predRes] = await Promise.all([
                    analyticsAPI.getUtilization(),
                    analyticsAPI.getEnvironmental(),
                    analyticsAPI.getTopPerformers(),
                    analyticsAPI.getPredictions({ resourceType: 'machine' }),
                ]);
                setUtilization(utilRes.data.data);
                setEnvironmental(envRes.data.data);
                setTopPerformers(topRes.data.data);
                setPredictions(predRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6"><div className="skeleton w-full h-32 rounded-xl" /></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Analytics & Insights</h1>
                <p className="text-sm text-[var(--text-secondary)]">AI-powered analytics and environmental impact tracking</p>
            </div>

            {/* Environmental Impact */}
            {environmental && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Leaf, label: 'CO₂ Saved', value: `${environmental.estimatedCO2Saved?.toFixed(0)} kg`, color: '#06d6a0' },
                        { icon: Zap, label: 'Waste Diverted', value: `${environmental.estimatedWasteDiverted?.toFixed(0)} kg`, color: '#4361ee' },
                        { icon: TreePine, label: 'Trees Equivalent', value: environmental.treesEquivalent, color: '#06d6a0' },
                        { icon: TrendingUp, label: 'Circular Score', value: `${environmental.circularEconomyScore}/100`, color: '#7209b7' },
                    ].map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="glass-card glass-card-hover p-5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}15` }}>
                                <item.icon size={20} style={{ color: item.color }} />
                            </div>
                            <div className="text-2xl font-bold mb-1">{item.value}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{item.label}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Utilization Pie */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-[var(--accent-cyan)]" /> Resource Distribution</h3>
                    {utilization.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={utilization} dataKey="total" nameKey="type" cx="50%" cy="50%"
                                    outerRadius={100} innerRadius={60} paddingAngle={4} strokeWidth={0}>
                                    {utilization.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                                <Legend formatter={(value) => <span className="text-[var(--text-secondary)] text-sm capitalize">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">No data available</div>
                    )}
                </motion.div>

                {/* Top Performers */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={18} className="text-[var(--accent-blue)]" /> Top Providers</h3>
                    {topPerformers.length > 0 ? (
                        <div className="space-y-3">
                            {topPerformers.map((p: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition">
                                    <span className="text-sm font-bold text-[var(--text-muted)] w-6">#{i + 1}</span>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${COLORS[i % 5]}20`, color: COLORS[i % 5] }}>
                                        {p.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{p.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{p.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">₹{(p.totalRevenue / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-[var(--text-muted)]">{p.transactions} txns</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">No performer data yet</div>
                    )}
                </motion.div>
            </div>

            {/* Demand Predictions */}
            {predictions && predictions.predictions && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><TrendingUp size={18} className="text-[var(--accent-purple)]" /> AI Demand Prediction — Machines</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">{predictions.suggestion}</p>
                    <div className="flex gap-3 mb-4">
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]">
                            Trend: {predictions.trend}
                        </span>
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                            Confidence: {(predictions.confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={predictions.predictions}>
                            <defs>
                                <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7209b7" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#7209b7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: '#55556a', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                            <Area type="monotone" dataKey="predictedDemand" stroke="#7209b7" fill="url(#predGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
}
