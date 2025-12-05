import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, BarChart3, Shield, Sparkles, Zap, ShoppingCart, Package, Users, Warehouse, LineChart as Line, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

// Animation variants for scroll effects
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}



const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// Scroll-triggered animation wrapper
function ScrollReveal({ children, variant = fadeInUp }: { children: React.ReactNode, variant?: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variant}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const logos = ['Acme Co', 'Globex', 'Umbrella', 'Wayne', 'Stark', 'Wonka', 'Aperture', 'Monsters Inc.']
  const apps = [
    { name: 'Sales', icon: ShoppingCart },
    { name: 'Products', icon: Package },
    { name: 'Customers', icon: Users },
    { name: 'Inventory', icon: Warehouse },
    { name: 'Analytics', icon: Line },
    { name: 'AI Reports', icon: Sparkles },
  ]
  const industries = [
    { title: 'Electronics', desc: 'Multi-location inventory, RMA flows, bundles.' },
    { title: 'Grocery', desc: 'Perishables, reorder points, demand spikes.' },
    { title: 'Fashion', desc: 'Variants, seasons, returns and exchanges.' },
    { title: 'Furniture', desc: 'Large SKUs, delivery slots, assembly tasks.' },
    { title: 'Pharmacy', desc: 'Batch tracking, expiry controls and audits.' },
    { title: 'Beauty', desc: 'Subscriptions, promos and loyalty perks.' },
  ]
  const testimonials = [
    { author: 'Priya S.', role: 'COO, UrbanMart', quote: 'We consolidated 7 tools into one. Forecast accuracy jumped 18%.' },
    { author: 'David R.', role: 'VP Ops, Nova Retail', quote: 'Inventory outs fell by a third in the first quarter.' },
    { author: 'Aisha K.', role: 'Head of BI, Trendy', quote: 'The AI reports save our team hours every week.' },
  ]
  const [index, setIndex] = useAutoCarousel(testimonials.length)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Hero Video Section */}
      <Hero />

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="container-shell h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-md">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">RetailAnalytics</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-neutral-100">Features</a>
            <a href="#industries" className="hover:text-neutral-900 dark:hover:text-neutral-100">Industries</a>
            <a href="#customers" className="hover:text-neutral-900 dark:hover:text-neutral-100">Customers</a>
            <a href="#pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100">Pricing</a>
            <Link to="/dashboard" className="btn btn-secondary h-9">Launch Demo</Link>
            <Link to="/reports" className="btn btn-primary h-9">Generate AI Report</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container-shell py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.p 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Retail Platform
            </motion.p>
            <h1 className="display-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-500">
              All your retail insights on one platform
            </h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
              Real-time analytics, sales forecasting, inventory optimization and AI-generated business reports—designed for modern retail teams.
            </p>
            <motion.div 
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/dashboard" className="btn btn-primary text-base h-11 px-6 group">
                Try the Dashboard 
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="btn btn-ghost text-base h-11 px-6">Explore features</a>
            </motion.div>
            <motion.div 
              className="mt-6 flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div><span className="font-semibold text-neutral-700 dark:text-neutral-200">99.9%</span> uptime</div>
              <div><span className="font-semibold text-neutral-700 dark:text-neutral-200">5 min</span> setup</div>
              <div><span className="font-semibold text-neutral-700 dark:text-neutral-200">GDPR</span> ready</div>
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <motion.div 
              className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-3xl rounded-full pointer-events-none"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div 
              className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 blur-3xl rounded-full pointer-events-none"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div 
              className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden bg-white dark:bg-neutral-900"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <img src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600&auto=format&fit=crop" alt="Dashboard preview" className="w-full aspect-[16/10] object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sticky section nav */}
      <div className="sticky top-16 z-30 bg-white/70 dark:bg-neutral-900/60 backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800/60">
        <nav className="container-shell hidden md:flex items-center gap-6 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 py-2">
          <a href="#features" className="hover:text-neutral-800 dark:hover:text-neutral-200">Features</a>
          <a href="#industries" className="hover:text-neutral-800 dark:hover:text-neutral-200">Industries</a>
          <a href="#apps" className="hover:text-neutral-800 dark:hover:text-neutral-200">Apps</a>
          <a href="#customers" className="hover:text-neutral-800 dark:hover:text-neutral-200">Testimonials</a>
          <a href="#pricing" className="hover:text-neutral-800 dark:hover:text-neutral-200">Pricing</a>
        </nav>
      </div>

      {/* Features */}
      <section id="features" className="container-shell py-12 md:py-20">
        <ScrollReveal>
          <h2 className="h2 mb-8 text-center">Why teams choose RetailAnalytics</h2>
        </ScrollReveal>
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={staggerItem}>
            <FeatureCard icon={Zap} title="Real-time KPIs" desc="Track revenue, orders, and inventory with live dashboards and accessible charts." />
          </motion.div>
          <motion.div variants={staggerItem}>
            <FeatureCard icon={Sparkles} title="AI Reports" desc="Generate executive summaries, deep analysis and recommendations in seconds." />
          </motion.div>
          <motion.div variants={staggerItem}>
            <FeatureCard icon={Shield} title="Enterprise-ready" desc="Secure by default with role-based access, audit logs and privacy controls." />
          </motion.div>
        </motion.div>
      </section>

      {/* Industries */}
      <section id="industries" className="container-shell py-12 md:py-18">
        <ScrollReveal>
          <h2 className="h2 mb-6 text-center">Built for modern retail</h2>
        </ScrollReveal>
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {industries.map((it) => (
            <motion.div 
              key={it.title} 
              className="card p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800"
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold mb-1 text-primary-700 dark:text-primary-400">{it.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{it.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* App Icon Grid */}
      <section id="apps" className="container-shell py-12">
        <ScrollReveal>
          <h2 className="h2 mb-6 text-center">Everything you need, nothing you don't</h2>
        </ScrollReveal>
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {apps.map(({ name, icon: Icon }) => (
            <motion.div 
              key={name} 
              className="card p-4 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-medium">{name}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Brand marquee */}
      <section className="py-10">
        <div className="overflow-hidden border-y border-neutral-200 dark:border-neutral-800">
          <div className="marquee flex items-center gap-12 py-6 text-neutral-500 dark:text-neutral-400">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="text-sm md:text-base tracking-wide whitespace-nowrap">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="container-shell py-12 md:py-20">
        <h2 className="h2 mb-8">Loved by retail operators</h2>
        <div className="relative">
          <div className="card p-6 md:p-8">
            <p className="text-lg md:text-xl mb-4">“{testimonials[index].quote}”</p>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">— {testimonials[index].author}, {testimonials[index].role}</div>
          </div>
          <div className="absolute -left-3 top-1/2 -translate-y-1/2">
            <button aria-label="Previous" className="btn btn-ghost" onClick={() => setIndex((i: number) => (i + testimonials.length - 1) % testimonials.length)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2">
            <button aria-label="Next" className="btn btn-ghost" onClick={() => setIndex((i: number) => (i + 1) % testimonials.length)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {testimonials.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-indigo-600' : 'w-3 bg-neutral-300 dark:bg-neutral-700'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-shell py-12 md:py-20">
        <ScrollReveal>
          <h2 className="h2 mb-8 text-center">Simple, transparent pricing</h2>
        </ScrollReveal>
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={staggerItem}>
            <PricingCard title="Starter" price="$0" period="/mo" features={["Up to 2 users", "Basic analytics", "Community support"]} cta="Get started" highlight={false} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PricingCard title="Growth" price="$49" period="/mo" features={["Up to 10 users", "AI reports", "Priority support"]} cta="Start trial" highlight />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PricingCard title="Scale" price="Custom" period="" features={["Unlimited users", "SSO & RBAC", "Dedicated success"]} cta="Contact sales" highlight={false} />
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container-shell py-14">
        <ScrollReveal variant={fadeInUp}>
          <motion.div 
            className="rounded-2xl p-8 md:p-12 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-indigo-600 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold">Ready to see it in action?</h3>
                <p className="opacity-90 mt-2">Spin up the demo dashboard and explore analytics with sample data.</p>
              </div>
              <Link 
                to="/dashboard" 
                className="btn bg-white text-indigo-700 hover:bg-white/90 hover:scale-105 transition-transform group"
              >
                Open Demo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform inline" />
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 mt-10">
        <ScrollReveal>
          <div className="container-shell flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <div>© {new Date().getFullYear()} RetailAnalytics. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">Terms</a>
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">Status</a>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="card p-6 bg-white dark:bg-neutral-900">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
    </div>
  )
}

function PricingCard({ title, price, period, features, cta, highlight }: { title: string; price: string; period: string; features: string[]; cta: string; highlight?: boolean }) {
  return (
    <div className={`card p-6 ${highlight ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="mb-2 text-sm font-medium text-neutral-500">{title}</div>
      <div className="flex items-end gap-1 mb-4">
        <div className="text-3xl font-extrabold">{price}</div>
        <div className="text-neutral-500">{period}</div>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-indigo-600" /> {f}</li>
        ))}
      </ul>
      <button className={`btn w-full ${highlight ? 'btn-primary' : 'btn-secondary'}`}>{cta}</button>
    </div>
  )
}

function useAutoCarousel(length: number) {
  const [i, setI] = useState<number>(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % length), 5000)
    return () => clearInterval(t)
  }, [length])
  return [i, setI] as const
}
