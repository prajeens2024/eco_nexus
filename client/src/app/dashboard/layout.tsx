'use client';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard, Package, ArrowLeftRight, Recycle, BarChart3,
    Users, LogOut, Menu, X, ChevronRight, Bell, Settings,
    Search, HelpCircle, Zap
} from 'lucide-react';

const navItems = {
    provider: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/resources', label: 'My Resources', icon: Package },
        { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
        { href: '/dashboard/scrap', label: 'Scrap Market', icon: Recycle },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
    consumer: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/resources', label: 'Browse Resources', icon: Package },
        { href: '/dashboard/transactions', label: 'My Bookings', icon: ArrowLeftRight },
        { href: '/dashboard/scrap', label: 'Scrap Market', icon: Recycle },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
    admin: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/resources', label: 'Resources', icon: Package },
        { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
        { href: '/dashboard/scrap', label: 'Scrap Market', icon: Recycle },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/dashboard/admin', label: 'Admin Panel', icon: Users },
    ],
};

function DashboardContent({ children }: { children: ReactNode }) {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-[var(--accent-cyan)]/30 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
                    <span className="text-sm text-[var(--text-muted)]">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const items = navItems[user.role as keyof typeof navItems] || navItems.consumer;
    const currentPage = items.find(i => i.href === pathname)?.label || 'Dashboard';

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            {/* ═══ Desktop Sidebar ═══ */}
            <aside className="hidden lg:flex flex-col w-[260px] border-r border-[var(--glass-border)] bg-[var(--bg-secondary)] shrink-0">
                <div className="p-5 border-b border-[var(--glass-border)]">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                        <div>
                            <span className="text-base font-bold block leading-tight">ECONEXUS</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{user.role} Portal</span>
                        </div>
                    </Link>
                </div>

                {/* Quick search */}
                <div className="px-4 pt-4">
                    <button onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition">
                        <Search size={14} /> Search resources...
                        <span className="ml-auto text-[10px] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded font-mono">⌘K</span>
                    </button>
                </div>

                <nav className="flex-1 p-3 pt-4 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-3 mb-2">Navigation</p>
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative group ${isActive
                                        ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)]'
                                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                                    }`}>
                                {isActive && (
                                    <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--accent-cyan)]"
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }} />
                                )}
                                <item.icon size={18} className={isActive ? '' : 'opacity-60 group-hover:opacity-100 transition-opacity'} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-3 space-y-2 border-t border-[var(--glass-border)]">
                    {/* Pro upgrade card */}
                    <div className="glass-card p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,214,160,0.04)] to-[rgba(67,97,238,0.04)]" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-[var(--accent-cyan)]" />
                                <span className="text-xs font-semibold">Upgrade to Pro</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] mb-2 leading-relaxed">Get advanced analytics, priority matching, and unlimited listings.</p>
                            <button className="text-[10px] font-semibold text-[var(--accent-cyan)] hover:underline">Learn more →</button>
                        </div>
                    </div>

                    {/* User card */}
                    <div className="glass-card p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)] capitalize">{user.role} · {user.company || 'No company'}</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-red-400 transition rounded-xl hover:bg-red-500/5">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ═══ Mobile Sidebar ═══ */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
                        <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--glass-border)] z-50 flex flex-col">
                            <div className="p-5 flex items-center justify-between border-b border-[var(--glass-border)]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                                    <span className="text-base font-bold">ECONEXUS</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="text-[var(--text-secondary)] hover:text-white transition">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 p-3 pt-4 space-y-1">
                                {items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${isActive ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)] hover:text-white'
                                                }`}>
                                            <item.icon size={18} /><span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-3 border-t border-[var(--glass-border)]">
                                <button onClick={logout}
                                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-red-400 transition rounded-xl hover:bg-red-500/5">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ Main Content ═══ */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-14 border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/85 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--text-secondary)] hover:text-white transition p-1">
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:block">
                            <h2 className="text-sm font-semibold">{currentPage}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition">
                            <HelpCircle size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition relative pulse-dot">
                            <Bell size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition">
                            <Settings size={16} />
                        </button>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold lg:hidden" style={{ background: 'var(--gradient-secondary)' }}>
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}>
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardContent>{children}</DashboardContent>;
}
