'use client';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard, Package, ArrowLeftRight, Recycle, BarChart3,
    Users, LogOut, Menu, X, ChevronRight, Bell, Settings
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

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-cyan)]/30 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const items = navItems[user.role] || navItems.consumer;

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--glass-border)] bg-[var(--bg-secondary)]">
                <div className="p-6 border-b border-[var(--glass-border)]">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                        <span className="text-lg font-bold">ECONEXUS</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative group ${isActive
                                    ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
                                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                                    }`}>
                                {isActive && (
                                    <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[var(--accent-cyan)]" />
                                )}
                                <item.icon size={18} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--glass-border)]">
                    <div className="glass-card p-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: 'var(--gradient-secondary)' }}>
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-[var(--text-muted)] capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-red-400 transition rounded-xl hover:bg-red-500/5">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
                        <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--glass-border)] z-50 flex flex-col">
                            <div className="p-6 flex items-center justify-between border-b border-[var(--glass-border)]">
                                <span className="text-lg font-bold">ECONEXUS</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-[var(--text-secondary)]"><X size={20} /></button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1">
                                {items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${isActive ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)] hover:text-white'}`}>
                                            <item.icon size={18} /><span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--text-secondary)]"><Menu size={20} /></button>
                        <h2 className="text-lg font-semibold hidden sm:block">
                            {items.find((i) => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-pink)]" />
                        </button>
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition">
                            <Settings size={18} />
                        </button>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold lg:hidden" style={{ background: 'var(--gradient-secondary)' }}>
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
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
