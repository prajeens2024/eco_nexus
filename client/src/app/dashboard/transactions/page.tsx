'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { transactionAPI } from '@/lib/api';
import { Transaction } from '@/types';
import {
    ArrowLeftRight, Check, Lock, AlertTriangle, DollarSign,
    Clock, ChevronDown, Eye
} from 'lucide-react';

const statusConfig: Record<string, { color: string; label: string }> = {
    requested: { color: '#fb8500', label: 'Requested' },
    approved: { color: '#4361ee', label: 'Approved' },
    payment_locked: { color: '#7209b7', label: 'Payment Locked' },
    in_progress: { color: '#4361ee', label: 'In Progress' },
    completed: { color: '#06d6a0', label: 'Completed' },
    payment_released: { color: '#06d6a0', label: 'Released' },
    disputed: { color: '#f72585', label: 'Disputed' },
    cancelled: { color: '#55556a', label: 'Cancelled' },
};

export default function TransactionsPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, [statusFilter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter) params.status = statusFilter;
            const res = await transactionAPI.getAll(params);
            setTransactions(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: string) => {
        try {
            switch (action) {
                case 'approve': await transactionAPI.approve(id); break;
                case 'lock': await transactionAPI.lockPayment(id); break;
                case 'complete': await transactionAPI.complete(id); break;
                case 'release': await transactionAPI.release(id, { rating: 5, review: 'Great service!' }); break;
                case 'dispute': await transactionAPI.dispute(id, { reason: 'Service not satisfactory' }); break;
            }
            fetchTransactions();
            setSelectedTxn(null);
        } catch (err) {
            console.error(err);
        }
    };

    const getActionButtons = (txn: Transaction) => {
        const isProvider = user?.role === 'provider' || (typeof txn.provider === 'object' && txn.provider._id === user?._id);
        const isConsumer = user?.role === 'consumer' || (typeof txn.consumer === 'object' && txn.consumer._id === user?._id);
        const buttons = [];

        if (txn.status === 'requested' && isProvider) {
            buttons.push({ label: 'Approve', action: 'approve', icon: Check, color: '#06d6a0' });
        }
        if (txn.status === 'approved' && isConsumer) {
            buttons.push({ label: 'Lock Payment', action: 'lock', icon: Lock, color: '#4361ee' });
        }
        if ((txn.status === 'payment_locked' || txn.status === 'in_progress') && isProvider) {
            buttons.push({ label: 'Complete', action: 'complete', icon: Check, color: '#06d6a0' });
        }
        if (txn.status === 'completed' && isConsumer) {
            buttons.push({ label: 'Release Payment', action: 'release', icon: DollarSign, color: '#06d6a0' });
        }
        if (!['payment_released', 'cancelled', 'disputed'].includes(txn.status)) {
            buttons.push({ label: 'Dispute', action: 'dispute', icon: AlertTriangle, color: '#f72585' });
        }
        return buttons;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{user?.role === 'consumer' ? 'My Bookings' : 'Transactions'}</h1>
                    <p className="text-sm text-[var(--text-secondary)]">{transactions.length} transactions</p>
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field appearance-none pr-10 cursor-pointer min-w-[160px] bg-[rgba(255,255,255,0.04)]">
                        <option value="" className="bg-[#12121a]">All Status</option>
                        {Object.entries(statusConfig).map(([key, val]) => (
                            <option key={key} value={key} className="bg-[#12121a]">{val.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-card p-5">
                            <div className="flex items-center gap-4">
                                <div className="skeleton w-12 h-12 rounded-xl" />
                                <div className="flex-1">
                                    <div className="skeleton w-48 h-5 mb-2" />
                                    <div className="skeleton w-32 h-4" />
                                </div>
                                <div className="skeleton w-20 h-6 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : transactions.length > 0 ? (
                <div className="space-y-3">
                    {transactions.map((txn, i) => {
                        const sc = statusConfig[txn.status] || statusConfig.requested;
                        const resource = typeof txn.resource === 'object' ? txn.resource : null;
                        const provider = typeof txn.provider === 'object' ? txn.provider : null;
                        const consumer = typeof txn.consumer === 'object' ? txn.consumer : null;
                        const actions = getActionButtons(txn);

                        return (
                            <motion.div key={txn._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card glass-card-hover p-5">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sc.color}15` }}>
                                        <ArrowLeftRight size={20} style={{ color: sc.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1">{resource?.title || 'Resource'}</h3>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {provider?.name || 'Provider'} → {consumer?.name || 'Consumer'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-semibold">₹{txn.amount?.toLocaleString()}</p>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {new Date(txn.startDate).toLocaleDateString()} — {new Date(txn.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ color: sc.color, background: `${sc.color}15` }}>
                                            {sc.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Timeline */}
                                {txn.timeline && txn.timeline.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                            {txn.timeline.map((event, ei) => (
                                                <div key={ei} className="flex items-center gap-2 shrink-0">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: statusConfig[event.status]?.color || '#555' }} />
                                                        <p className="text-[10px] text-[var(--text-muted)] mt-1 whitespace-nowrap">{event.event}</p>
                                                    </div>
                                                    {ei < txn.timeline.length - 1 && <div className="w-8 h-px bg-[var(--glass-border)]" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                {actions.length > 0 && (
                                    <div className="mt-3 flex gap-2">
                                        {actions.map((btn) => (
                                            <button key={btn.action} onClick={() => handleAction(txn._id, btn.action)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                                                style={{ color: btn.color, background: `${btn.color}15` }}>
                                                <btn.icon size={12} /> {btn.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <ArrowLeftRight size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                    <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Transactions will appear here once you book or list resources.</p>
                </div>
            )}
        </div>
    );
}
