'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { resourceAPI } from '@/lib/api';
import { Resource } from '@/types';
import {
    Search, Filter, Plus, MapPin, Clock, DollarSign,
    Cpu, Users, Warehouse, Recycle, Star, X,
    ChevronDown, Eye, Package
} from 'lucide-react';
import Link from 'next/link';

const typeIcons: Record<string, any> = { machine: Cpu, labor: Users, warehouse: Warehouse, scrap: Recycle };
const typeColors: Record<string, string> = { machine: '#06d6a0', labor: '#4361ee', warehouse: '#7209b7', scrap: '#f72585' };

function ResourceCard({ resource, idx }: { resource: Resource; idx: number }) {
    const Icon = typeIcons[resource.type] || Cpu;
    const color = typeColors[resource.type] || '#06d6a0';
    const owner = typeof resource.owner === 'object' ? resource.owner : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="glass-card glass-card-hover p-5 group">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium status-${resource.status}`}>
                    {resource.status}
                </span>
            </div>

            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-[var(--accent-cyan)] transition">{resource.title}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{resource.description}</p>

            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                    <MapPin size={12} /> {resource.location?.city || 'N/A'}, {resource.location?.state || ''}
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={12} /> ₹{resource.priceModel.amount.toLocaleString()}/{resource.priceModel.type}
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={12} /> {resource.capacity.value} {resource.capacity.unit}
                </div>
            </div>

            {owner && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                        {owner.name?.charAt(0)}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{owner.company || owner.name}</span>
                    {owner.reputation > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-[var(--accent-orange)]">
                            <Star size={10} fill="currentColor" /> {owner.reputation.toFixed(1)}
                        </span>
                    )}
                </div>
            )}

            <Link href={`/dashboard/resources/${resource._id}`}
                className="mt-3 w-full btn-secondary py-2 text-xs flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={12} /> View Details
            </Link>
        </motion.div>
    );
}

export default function ResourcesPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newResource, setNewResource] = useState({
        title: '', type: 'machine', description: '', capacityValue: 1, capacityUnit: 'hours/day',
        city: '', state: '', priceType: 'hourly', priceAmount: 0,
        availableFrom: '', availableTo: '', tags: '',
    });

    useEffect(() => {
        fetchResources();
    }, [typeFilter, statusFilter]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (typeFilter) params.type = typeFilter;
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;

            const res = user?.role === 'provider'
                ? await resourceAPI.getMy()
                : await resourceAPI.getAll(params);
            setResources(res.data.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchResources();
    };

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const now = new Date();
            await resourceAPI.create({
                title: newResource.title,
                type: newResource.type,
                description: newResource.description,
                capacity: { value: newResource.capacityValue, unit: newResource.capacityUnit },
                location: { type: 'Point', coordinates: [0, 0], address: '', city: newResource.city, state: newResource.state },
                priceModel: { type: newResource.priceType, amount: newResource.priceAmount, currency: 'INR' },
                availableFrom: newResource.availableFrom || now.toISOString(),
                availableTo: newResource.availableTo || new Date(now.getTime() + 90 * 86400000).toISOString(),
                tags: newResource.tags.split(',').map(t => t.trim()).filter(Boolean),
            });
            setShowCreateModal(false);
            fetchResources();
        } catch (error) {
            console.error('Error creating resource:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{user?.role === 'provider' ? 'My Resources' : 'Browse Resources'}</h1>
                    <p className="text-sm text-[var(--text-secondary)]">{resources.length} resources found</p>
                </div>
                {user?.role === 'provider' && (
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 text-sm">
                        <Plus size={16} /> Add Resource
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11 pr-4" placeholder="Search resources..." />
                </form>
                <div className="relative">
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                        className="input-field appearance-none pr-10 cursor-pointer min-w-[140px] bg-[rgba(255,255,255,0.04)]">
                        <option value="" className="bg-[#12121a]">All Types</option>
                        <option value="machine" className="bg-[#12121a]">Machines</option>
                        <option value="labor" className="bg-[#12121a]">Labor</option>
                        <option value="warehouse" className="bg-[#12121a]">Warehouse</option>
                        <option value="scrap" className="bg-[#12121a]">Scrap</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field appearance-none pr-10 cursor-pointer min-w-[140px] bg-[rgba(255,255,255,0.04)]">
                        <option value="" className="bg-[#12121a]">All Status</option>
                        <option value="active" className="bg-[#12121a]">Active</option>
                        <option value="booked" className="bg-[#12121a]">Booked</option>
                        <option value="inactive" className="bg-[#12121a]">Inactive</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card p-5">
                            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
                            <div className="skeleton w-3/4 h-5 mb-2" />
                            <div className="skeleton w-full h-4 mb-1" />
                            <div className="skeleton w-2/3 h-4 mb-3" />
                            <div className="skeleton w-1/2 h-3" />
                        </div>
                    ))}
                </div>
            ) : resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource, i) => (
                        <ResourceCard key={resource._id} resource={resource} idx={i} />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Package size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                    <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {user?.role === 'provider' ? 'Start by listing your first resource' : 'Try adjusting your filters'}
                    </p>
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowCreateModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-8 w-full max-w-lg z-50 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Add New Resource</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-secondary)] hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateResource} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Title</label>
                                    <input className="input-field" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Type</label>
                                        <select className="input-field bg-[rgba(255,255,255,0.04)]" value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}>
                                            <option value="machine" className="bg-[#12121a]">Machine</option>
                                            <option value="labor" className="bg-[#12121a]">Labor</option>
                                            <option value="warehouse" className="bg-[#12121a]">Warehouse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Price (₹)</label>
                                        <input type="number" className="input-field" value={newResource.priceAmount} onChange={(e) => setNewResource({ ...newResource, priceAmount: Number(e.target.value) })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Description</label>
                                    <textarea className="input-field min-h-[80px]" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1">City</label>
                                        <input className="input-field" value={newResource.city} onChange={(e) => setNewResource({ ...newResource, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1">State</label>
                                        <input className="input-field" value={newResource.state} onChange={(e) => setNewResource({ ...newResource, state: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Tags (comma separated)</label>
                                    <input className="input-field" value={newResource.tags} onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })} placeholder="cnc, milling, precision" />
                                </div>
                                <button type="submit" className="btn-primary w-full">Create Resource</button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
