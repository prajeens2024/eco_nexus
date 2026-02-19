'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Cpu, Users, Warehouse, Recycle, BarChart3,
  Shield, Zap, Globe, CheckCircle2, ChevronRight, Play,
  TrendingUp, Building2, Leaf, Target, ArrowUpRight,
  Star, Quote, Menu, X
} from 'lucide-react';

/* ─── Animated Counter ─── */
function Counter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const features = [
  { icon: Cpu, title: 'Industrial Machinery', desc: 'Share CNC machines, lathes, hydraulic presses, and 3D printers. Earn ₹50K–₹5L/month from idle equipment.', color: '#06d6a0', stat: '340+ machines listed' },
  { icon: Users, title: 'Skilled Labor Pool', desc: 'Access certified welders, assembly technicians, CNC operators, and QA inspectors — vetted and rated.', color: '#4361ee', stat: '1,200+ workers' },
  { icon: Warehouse, title: 'Warehouse & Storage', desc: 'Cold storage, open yards, climate-controlled facilities. Book by day, week, or month with live availability.', color: '#7209b7', stat: '85K sq ft available' },
  { icon: Recycle, title: 'Scrap Marketplace', desc: 'Trade ferrous metals, plastics, e-waste, rubber at transparent market rates with quality grading.', color: '#f72585', stat: 'Live market pricing' },
  { icon: BarChart3, title: 'AI Demand Forecasting', desc: 'Machine learning models predict resource demand 30 days ahead. Optimize pricing and availability automatically.', color: '#fb8500', stat: '92% prediction accuracy' },
  { icon: Shield, title: 'Escrow & Safe Payments', desc: 'Funds are locked until both parties confirm delivery. Dispute resolution with transparent timelines.', color: '#06d6a0', stat: '₹0 fraud losses' },
];

const stats = [
  { value: 250, suffix: 'Cr+', prefix: '₹', label: 'Resources Traded', icon: TrendingUp },
  { value: 500, suffix: '+', prefix: '', label: 'MSMEs Connected', icon: Building2 },
  { value: 85, suffix: '%', prefix: '', label: 'Utilization Boost', icon: Target },
  { value: 12000, suffix: '', prefix: '', label: 'Tons CO₂ Saved', icon: Leaf },
];

const steps = [
  { num: '01', title: 'List Your Resources', desc: 'Add idle machinery, labor availability, or warehouse space with photos, specs, and pricing.', color: '#06d6a0' },
  { num: '02', title: 'AI Matches Demand', desc: 'Our algorithm finds the best matches based on proximity, availability, cost, and reputation scores.', color: '#4361ee' },
  { num: '03', title: 'Secure Transaction', desc: 'Escrow-protected payments, real-time tracking, and automated lifecycle management.', color: '#7209b7' },
  { num: '04', title: 'Scale & Optimize', desc: 'Use predictive analytics to forecast demand, adjust pricing, and maximize your resource utilization.', color: '#f72585' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'CEO, Kumar Precision Engineering', text: 'Our CNC machines sat idle 60% of the time. Through ECONEXUS, we now earn ₹3.2L/month from that idle capacity. Game-changer for our bottom line.', rating: 5, avatar: 'RK' },
  { name: 'Priya Sharma', role: 'Operations Head, GreenTech Mfg', text: 'The scrap marketplace alone saved us ₹18L last quarter. Real-time pricing transparency means we never undersell our industrial waste again.', rating: 5, avatar: 'PS' },
  { name: 'Vikram Patel', role: 'Founder, AgriPack Solutions', text: 'We needed cold storage for 3 months during peak season. ECONEXUS matched us with a warehouse 6km away — 40% cheaper than commercial rates.', rating: 5, avatar: 'VP' },
];

const logos = ['Tata Steel', 'L&T', 'Mahindra', 'Godrej', 'Bharat Forge', 'TVS Motor'];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* ═══ Animated Grid Background ═══ */}
      <div className="fixed inset-0 grid-bg-animated pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(6,214,160,0.06),transparent_70%)]" style={{ animation: 'float-slow 20s ease-in-out infinite' }} />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(67,97,238,0.06),transparent_70%)]" style={{ animation: 'float-slow 25s ease-in-out infinite reverse' }} />
        <div className="absolute bottom-[-15%] left-[25%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(114,9,183,0.04),transparent_70%)]" style={{ animation: 'float-slow 30s ease-in-out infinite' }} />
      </div>

      {/* ═══ Navigation ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[rgba(6,6,11,0.75)] border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold border-gradient" style={{ background: 'var(--gradient-primary)' }}>
              EN
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ECONEXUS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {['Features', 'How It Works', 'Impact', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[var(--text-secondary)] hover:text-white transition-colors duration-200">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Log In</Link>
            <Link href="/register" className="btn-primary text-sm py-2.5 px-5">
              Get Started Free <ArrowRight size={14} />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[var(--text-secondary)]">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-[var(--glass-border)] bg-[var(--bg-secondary)] px-6 py-4 space-y-3">
            {['Features', 'How It Works', 'Impact', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[var(--text-secondary)] hover:text-white py-2">{item}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="btn-secondary text-sm py-2 px-4 flex-1 justify-center">Log In</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4 flex-1 justify-center">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 pt-28 sm:pt-36 pb-16 sm:pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-sm text-[var(--text-secondary)] mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]" />
            </span>
            AI-Powered Industrial Resource Optimization
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.08] tracking-tight mb-6">
            Transform{' '}
            <span className="gradient-text relative">
              Idle Capacity
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"><path d="M2 10C50 2 250 2 298 10" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" /><defs><linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0"><stop stopColor="#06d6a0" /><stop offset="1" stopColor="#4361ee" /></linearGradient></defs></svg>
            </span>
            <br />
            Into Economic Value
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect MSMEs to share machinery, labor, and warehouse space.
            Trade industrial scrap. Reduce waste. Build a circular economy — powered by predictive AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register" className="btn-primary text-base py-3.5 px-8">
              Start Optimizing <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary text-base py-3.5 px-8">
              <Play size={16} className="text-[var(--accent-cyan)]" /> Watch Demo
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">Trusted by leading manufacturers</p>
            <div className="flex items-center gap-8 opacity-40">
              {logos.map(logo => (
                <span key={logo} className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] whitespace-nowrap">{logo}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ STATS ═══ */}
      <section id="impact" className="relative z-10 py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card glass-card-hover p-6 sm:p-8 text-center group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                  style={{ background: 'var(--accent-cyan-dim)' }}>
                  <stat.icon size={20} className="text-[var(--accent-cyan)]" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text mb-2">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-cyan)] font-semibold mb-3 block">Platform Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need for <span className="gradient-text">Circular Industry</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base sm:text-lg">
              A complete platform for sharing resources, optimizing operations, and building sustainable industrial networks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card glass-card-interactive p-6 group relative overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ background: `${feature.color}12`, boxShadow: `0 0 0 0 ${feature.color}00` }}>
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <ArrowUpRight size={16} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="text-base font-semibold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{feature.desc}</p>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: feature.color }}>
                  <CheckCircle2 size={12} /> {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-semibold mb-3 block">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text-blue">ECONEXUS</span> Works
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">From listing to earning — four simple steps to transform your idle resources into revenue.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                className="glass-card glass-card-hover p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-5xl sm:text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity" style={{ color: step.color }}>
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-mono font-bold text-sm"
                  style={{ background: `${step.color}15`, color: step.color }}>
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-purple)] font-semibold mb-3 block">Success Stories</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our <span className="gradient-text-cool">Partners</span> Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 sm:p-8 relative">
                <Quote size={24} className="text-[var(--accent-cyan)] opacity-20 mb-4" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'var(--gradient-primary)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={12} className="text-[var(--accent-orange)]" fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card border-gradient p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,214,160,0.04)] via-transparent to-[rgba(67,97,238,0.04)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-30" />

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-[var(--accent-cyan)] font-semibold mb-4 block">Start Today</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to <span className="gradient-text-warm">Revolutionize</span> Your Operations?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto text-base sm:text-lg">
                Join 500+ MSMEs already saving costs and reducing waste through our AI-driven circular economy platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="btn-primary text-base py-3.5 px-8">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-secondary text-base py-3.5 px-8">
                  Schedule a Demo <ChevronRight size={16} />
                </Link>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-6">No credit card required · Free forever for small teams</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-[var(--glass-border)] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-primary)' }}>EN</div>
                <span className="text-base font-bold">ECONEXUS</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[240px]">
                AI-driven circular economy platform connecting MSMEs for resource sharing and waste reduction.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><Link href="/register" className="hover:text-white transition">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Log In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
                <li><span className="hover:text-white transition cursor-pointer">API Documentation</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Developer Guide</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Case Studies</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Blog</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
                <li><span className="hover:text-white transition cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Contact</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--glass-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)]">© 2025 ECONEXUS. All rights reserved. Built for India&apos;s MSMEs.</p>
            <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
              <span>Made with ❤️ in India</span>
              <span>•</span>
              <span>Circular Economy</span>
              <span>•</span>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
