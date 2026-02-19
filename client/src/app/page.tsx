'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Cpu, Users, Warehouse, Recycle, BarChart3, Shield, Zap, Globe } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const features = [
  { icon: Cpu, title: 'Share Machinery', desc: 'List idle CNC machines, lathes, presses — earn from idle capacity.', color: '#06d6a0' },
  { icon: Users, title: 'Labor Exchange', desc: 'Certified welders, assembly crews, QA teams — on demand.', color: '#4361ee' },
  { icon: Warehouse, title: 'Warehouse Space', desc: 'Rent cold storage, open yards, or climate-controlled warehouses.', color: '#7209b7' },
  { icon: Recycle, title: 'Scrap Marketplace', desc: 'Trade ferrous metals, plastics, e-waste with real-time pricing.', color: '#f72585' },
  { icon: BarChart3, title: 'Predictive Analytics', desc: 'AI-powered demand forecasting and resource optimization.', color: '#fb8500' },
  { icon: Shield, title: 'Secure Escrow', desc: 'Mock escrow transactions with full lifecycle tracking.', color: '#06d6a0' },
];

const stats = [
  { value: '₹2.5Cr+', label: 'Resources Traded' },
  { value: '500+', label: 'MSMEs Connected' },
  { value: '85%', label: 'Utilization Boost' },
  { value: '12K', label: 'Tons CO₂ Saved' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.08),transparent_70%)]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(67,97,238,0.08),transparent_70%)]" />
        <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(114,9,183,0.06),transparent_70%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(10,10,15,0.7)] border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-primary)' }}>
              EN
            </div>
            <span className="text-lg font-bold text-white">ECONEXUS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#stats" className="hover:text-white transition">Impact</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4 flex items-center gap-1">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-sm text-[var(--text-secondary)] mb-6">
            <Zap size={14} className="text-[var(--accent-cyan)]" /> AI-Powered Industrial Resource Optimization
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            Transform{' '}
            <span className="gradient-text">Idle Capacity</span>
            <br />
            Into Economic Value
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect MSMEs to share machinery, labor, and warehouse space. Trade industrial scrap. Reduce waste. Build a circular economy — powered by predictive AI.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base py-3 px-8 flex items-center gap-2">
              Start Optimizing <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary text-base py-3 px-8 flex items-center gap-2">
              <Globe size={18} /> Explore Platform
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card p-6 text-center">
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for <span className="gradient-text">Circular Industry</span></h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">A complete platform for sharing resources, optimizing operations, and building sustainable industrial networks.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card glass-card-hover p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${feature.color}15` }}>
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,214,160,0.05)] to-[rgba(67,97,238,0.05)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to <span className="gradient-text-warm">Revolutionize</span> Your Operations?</h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">Join 500+ MSMEs already saving costs and reducing waste through our AI-driven platform.</p>
              <Link href="/register" className="btn-primary text-base py-3 px-8 inline-flex items-center gap-2">
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--glass-border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
            <span className="text-sm text-[var(--text-secondary)]">ECONEXUS © 2025. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <span>Built for MSMEs</span>
            <span>•</span>
            <span>Circular Economy</span>
            <span>•</span>
            <span>AI-Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
