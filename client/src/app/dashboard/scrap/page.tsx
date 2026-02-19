'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { scrapAPI } from '@/lib/api';
import { ScrapListing } from '@/types';
import { Recycle, TrendingUp, TrendingDown, Minus, MapPin, Weight, DollarSign, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const categoryLabels: Record<string, string> = {
    ferrous_metal: 'Ferrous Metal', non_ferrous_metal: 'Non-Ferrous Metal', plastic: 'Plastic',
    rubber: 'Rubber', glass: 'Glass', paper: 'Paper', electronic: 'E-Waste', textile: 'Textile', chemical: 'Chemical', other: 'Other',
};
const categoryColors: Record<string, string> = {
    ferrous_metal: '#06d6a0', non_ferrous_metal: '#4361ee', plastic: '#7209b7',
    rubber: '#fb8500', glass: '#55a0d2', paper: '#f5c542', electronic: '#f72585', textile: '#8338ec', chemical: '#ff6b6b', other: '#888',
};

export default function ScrapPage() {
    const [listings, setListings] = useState<ScrapListing[]>([]);
    const [marketRates, setMarketRates] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'listings' | 'rates' | 'trends'>('listings');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingsRes, ratesRes, trendsRes] = await Promise.all([
                    scrapAPI.getAll({ category: categoryFilter || undefined }),
                    scrapAPI.getMarketRates(),
                    scrapAPI.getTrends(),
                ]);
                setListings(listingsRes.data.data);
                setMarketRates(ratesRes.data.data);
                setTrends(trendsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryFilter]);

    const tabs = [
        { key: 'listings' as const, label: 'Listings' },
        { key: 'rates' as const, label: 'Market Rates' },
        { key: 'trends' as const, label: 'Price Trends' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Scrap Marketplace</h1>
                <p className="text-sm text-[var(--text-secondary)]">Trade industrial scrap with transparent pricing</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 glass-card w-fit">
                {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab.key ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'listings' && (
                <>
                    <div className="relative w-fit">
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input-field appearance-none pr-10 cursor-pointer min-w-[180px] bg-[rgba(255,255,255,0.04)]">
                            <option value="" className="bg-[#12121a]">All Categories</option>
                            {Object.entries(categoryLabels).map(([key, label]) => (
                                <option key={key} value={key} className="bg-[#12121a]">{label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="glass-card p-5"><div className="skeleton w-full h-40 rounded-xl" /></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {listings.map((item, i) => {
                                const seller = typeof item.seller === 'object' ? item.seller : null;
                                const color = categoryColors[item.category] || '#888';
                                return (
                                    <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ color, background: `${color}15` }}>
                                                {categoryLabels[item.category] || item.category}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${item.quality === 'premium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-[var(--text-secondary)] bg-white/5'}`}>
                                                {item.quality}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                                        <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{item.description}</p>
                                        <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1"><DollarSign size={12} /> ₹{item.pricePerUnit}/{item.unit}</span>
                                                <span className="text-[var(--text-muted)]">Market: ₹{item.marketRate}</span>
                                            </div>
                                            <div className="flex items-center gap-2"><Weight size={12} /> {item.quantity.toLocaleString()} {item.unit}</div>
                                            <div className="flex items-center gap-2"><MapPin size={12} /> {item.location?.city}</div>
                                        </div>
                                        {seller && (
                                            <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                                <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                                                    {seller.name?.charAt(0)}
                                                </div>
                                                {seller.company || seller.name}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'rates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketRates.map((rate, i) => {
                        const color = categoryColors[rate.category] || '#888';
                        return (
                            <motion.div key={rate.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }} className="glass-card p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold">{categoryLabels[rate.category]}</span>
                                    <div className="flex items-center gap-1" style={{ color: rate.trend > 0 ? '#06d6a0' : rate.trend < 0 ? '#f72585' : '#888' }}>
                                        {rate.trend > 0 ? <TrendingUp size={14} /> : rate.trend < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                                        <span className="text-xs font-medium">{rate.trend > 0 ? '+' : ''}{rate.trend}%</span>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold" style={{ color }}>₹{rate.rate.toFixed(2)}</div>
                                <p className="text-xs text-[var(--text-muted)]">per kg · updated just now</p>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'trends' && trends.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">30-Day Price Trends</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={trends[0]?.history || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: '#55556a', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#55556a', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                            <Line type="monotone" dataKey="price" stroke="#06d6a0" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
}
