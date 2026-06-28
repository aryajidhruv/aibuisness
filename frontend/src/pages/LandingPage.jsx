import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── DATA ──
const STATS = [
  { num: '10x',   label: 'Faster Outreach' },
  { num: '94%',   label: 'Call Completion' },
  { num: '3 min', label: 'To Launch' },
]

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign in with Google or email. Your workspace is ready in seconds.', points: ['Sign in instantly with Google', 'Create secure login credentials', 'Connect your business profile'] },
  { num: '02', title: 'Upload Your Contact List', desc: 'Paste numbers or upload a CSV. We handle duplicates and formatting.', points: ['Upload CSV with name & phone', 'Paste numbers directly', 'AI validates and formats contacts'] },
  { num: '03', title: 'Launch AI Campaign', desc: 'Set your script, pick a goal, and let AI call every contact for you.', points: ['Prompt the AI with your goal', 'Let agent handle calls end-to-end', 'Get instant results & transcripts'] },
]

const FEATURES_TABS = [
  { label: 'Voice AI', icon: '🗣️' },
  { label: 'Analytics', icon: '📊' },
  { label: 'Workflow', icon: '🔀' },
]

const FEATURES_CONTENT = [
  {
    title: 'AI Voice Agent for Sales',
    desc: 'Connect to your contact list, set your goal, and deploy an AI agent that holds real two-way conversations — not robocalls.',
    tags: ['Lead Generation', 'Follow-ups', 'Surveys', 'Reminders'],
    mockup: [
      { name: 'Rahul S.',  status: 'Interested', color: '#10b981' },
      { name: 'Meera K.', status: 'Callback',   color: '#f59e0b' },
      { name: 'Ankit V.', status: 'Not Now',    color: '#ef4444' },
      { name: 'Divya R.', status: 'Interested', color: '#10b981' },
    ]
  },
  {
    title: 'Real-Time Analytics Dashboard',
    desc: 'Watch every call happen live. Get sentiment scores, transcripts, and summaries automatically after each conversation.',
    tags: ['Sentiment Score', 'Live Tracker', 'Call Transcripts', 'AI Summary'],
    mockup: [
      { name: 'Total Calls',  status: '1,284', color: '#3b82f6' },
      { name: 'Answered',     status: '94%',   color: '#10b981' },
      { name: 'Hot Leads',    status: '342',   color: '#f59e0b' },
      { name: 'Avg Duration', status: '2:34',  color: '#a855f7' },
    ]
  },
  {
    title: 'Visual Workflow Builder',
    desc: 'Drag and drop nodes to build complex calling workflows. Connect triggers, AI logic, and actions visually.',
    tags: ['Drag & Drop', 'If/Else Logic', 'CSV Trigger', 'Webhook Actions'],
    mockup: [
      { name: 'Upload List → Voice Call', status: 'Trigger', color: '#2563eb' },
      { name: 'If/Else Score Check',      status: 'Logic',   color: '#ea580c' },
      { name: 'Webhook → CRM',            status: 'Action',  color: '#10b981' },
      { name: 'AI Enrich Lead',           status: 'AI Node', color: '#a855f7' },
    ]
  },
]

const PLANS = [
  {
    name: 'Starter', tag: 'SONIC', price: '₹1,999', per: '/mo',
    desc: 'For businesses testing AI calling',
    features: ['500 calls / month', 'Basic sentiment analysis', 'CSV upload', 'Email support', '5,000 AI actions/mo'],
    highlight: false, badge: '300+ teams trusted this'
  },
  {
    name: 'Growth', tag: 'SUPERSONIC', price: '₹5,999', per: '/mo',
    desc: 'For teams running regular campaigns',
    features: ['2,500 calls / month', 'Full AI analysis', 'Live dashboard', 'Priority support', '20,000 AI actions/mo'],
    highlight: true, badge: '250+ growing businesses'
  },
  {
    name: 'Enterprise', tag: 'HYPERSONIC', price: 'Custom', per: '',
    desc: 'Unlimited automation with dedicated support',
    features: ['Unlimited calls', 'Dedicated AI model', 'Full API access', 'SLA + onboarding', 'White-label option'],
    highlight: false, badge: 'Enterprise grade'
  },
]

const TESTIMONIALS = [
  { quote: 'We used to have 8 people making calls all day. Now CallIQ handles 5x the volume overnight. It has transformed our sales operations completely.', name: 'Rohan Mehta', role: 'VP Sales, FinEdge' },
  { quote: 'The sentiment scores alone saved us hours of manual lead qualification every week. Truly redefining enterprise outreach automation.', name: 'Priya Sharma', role: 'Growth Lead, Bharat Health' },
  { quote: 'Set up a 1,200-contact campaign in 10 minutes. Results were in the dashboard by morning. Incredible speed and accuracy.', name: 'Arjun Nair', role: 'Founder, QuickServe' },
  { quote: 'Best AI calling tool for Indian businesses hands down. The Hindi support and sentiment analysis is unmatched in the market.', name: 'Sneha Patel', role: 'CEO, GrowthBox' },
]

const FAQS = [
  { q: 'What is CallIQ?', a: 'CallIQ is an AI-powered outbound calling platform for Indian businesses. It calls your contacts, holds real two-way conversations, and delivers instant results with transcripts and sentiment analysis.' },
  { q: 'How is CallIQ different from a robocall?', a: 'Unlike robocalls, CallIQ uses advanced AI to listen and respond naturally to whatever the contact says — adapting the conversation in real-time, not just playing a recording.' },
  { q: 'Can CallIQ handle Hindi and regional languages?', a: 'Yes! CallIQ supports Hindi, English, Hinglish, Tamil, Telugu, and Marathi. The AI adapts to the language the contact speaks in.' },
  { q: 'How quickly can I launch a campaign?', a: 'In under 3 minutes. Upload your CSV, write your script, and hit launch. The AI handles everything from there.' },
  { q: 'Is my data secure?', a: 'Yes. All call data, transcripts, and contact information are encrypted and stored securely on MongoDB Atlas with enterprise-grade security.' },
  { q: 'Can I integrate with my CRM?', a: 'Yes, via Webhooks you can push call results to any CRM like HubSpot, Salesforce, or Zoho in real-time.' },
]

const INTEGRATIONS = ['🔗 HubSpot', '📊 Salesforce', '💬 Slack', '📋 Notion', '📧 Gmail', '🗂️ Zoho', '⚡ Zapier', '🌐 Webhook']

// ── MOTION HELPERS ──
const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
}

const staggerParent = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

function Reveal({ children, variants = fadeUp, className = '', viewportAmount = 0.2, ...props }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: viewportAmount }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function Badge({ children }) {
  return (
    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-widest uppercase">
      {children}
    </motion.div>
  )
}

export default function LandingPage({ navigate }) {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [activeTab, setActiveTab]       = useState(0)
  const [activeFaq, setActiveFaq]       = useState(null)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [billing, setBilling]           = useState('monthly')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const content = FEATURES_CONTENT[activeTab]

  return (
    <div className="min-h-screen bg-[#06080F] text-white antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-16 transition-all duration-300 ${scrolled ? 'bg-[#06080F]/95 border-b border-white/5 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl font-black cursor-pointer select-none tracking-tight">
          Call<span className="text-blue-400">IQ</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'How it works'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm text-slate-400 hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('login')}
            className="text-sm text-slate-300 px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
            Log in
          </button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
            className="text-sm bg-white text-black font-semibold px-5 py-2 rounded-lg hover:bg-slate-100 transition-all">
            Get Started
          </motion.button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(o => !o)}>
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#06080F]/98 flex flex-col items-center justify-center gap-6">
            <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-6 text-slate-400 text-2xl">✕</button>
            {['Features', 'Pricing', 'How it works'].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                {l}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
              onClick={() => { setMenuOpen(false); navigate('onboarding') }}
              className="mt-4 bg-white text-black font-bold px-8 py-3 rounded-xl text-lg">
              Get Started
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #ffffff04 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <motion.div
          variants={staggerParent(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now Live · AI Calling Platform for India
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-[1.02] tracking-tight mb-6"
            style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            Next-gen outreach<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              with AI Voice Agents
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Accelerate sales with CallIQ — your AI agent calls every contact, holds real conversations, and delivers instant results with transcripts and sentiment scores.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
              className="bg-white text-black font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all text-sm w-full sm:w-auto">
              Get Started Free →
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('login')}
              className="bg-white/5 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm w-full sm:w-auto">
              View Demo Dashboard
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-12 border-t border-white/5 pt-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: EASE }}
                className="text-center">
                <div className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.num}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className="relative z-10 mt-16 w-full max-w-5xl mx-auto">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4, ease: EASE }} className="rounded-2xl border border-white/10 overflow-hidden bg-[#0D1117] shadow-2xl shadow-black/80">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-slate-500 ml-3 font-mono">calliq.in/dashboard</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Live</span>
              </div>
            </div>
            <motion.div
              variants={staggerParent(0.08, 0.7)}
              initial="hidden"
              animate="show"
              className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[['1,284', '📞 Total Calls'], ['94%', '✅ Answered'], ['342', '🔥 Hot Leads']].map(([n, l]) => (
                <motion.div key={l} variants={fadeUp} className="bg-[#161B22] border border-white/5 rounded-xl p-4">
                  <div className="text-2xl font-black text-white">{n}</div>
                  <div className="text-xs text-slate-500 mt-1">{l}</div>
                </motion.div>
              ))}
              {[
                { name: 'Rahul S.',  status: 'Interested', c: '#10b981' },
                { name: 'Meera K.', status: 'Callback',   c: '#f59e0b' },
                { name: 'Ankit V.', status: 'Not Now',    c: '#ef4444' },
              ].map(r => (
                <motion.div key={r.name} variants={fadeUp} className="col-span-1 md:col-span-1 bg-[#161B22] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center">{r.name[0]}</div>
                    <span className="text-sm text-slate-300">{r.name}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: r.c, background: `${r.c}20` }}>{r.status}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/10 blur-3xl rounded-full" />
        </motion.div>
      </section>

      {/* ── LOGO STRIP ── */}
      <Reveal variants={fadeIn} className="py-12 border-y border-white/5 overflow-hidden">
        <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8">Trusted by fast-growing Indian businesses</p>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {['FinEdge', 'Bharat Health', 'QuickServe', 'GrowthBox', 'SalesForce India', 'EduTech Pro', 'InsureIQ', 'RealEstate.AI', 'FinEdge', 'Bharat Health', 'QuickServe', 'GrowthBox'].map((b, i) => (
            <span key={i} className="text-slate-600 font-bold text-sm tracking-wider">{b}</span>
          ))}
        </div>
      </Reveal>
      {/* ── FEATURES TABS ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <Badge>FEATURES</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              All-in-one AI for<br />Indian businesses
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mt-4 text-lg">Simplify, accelerate, and transform with one connected AI ecosystem.</motion.p>
          </motion.div>

          {/* Tabs */}
          <Reveal variants={fadeUp} className="flex items-center justify-center gap-2 mb-12">
            {FEATURES_TABS.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === i ? 'text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                {activeTab === i && (
                  <motion.span
                    layoutId="activeFeatureTab"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><span>{tab.icon}</span> {tab.label}</span>
              </button>
            ))}
          </Reveal>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h3 className="text-2xl font-black mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{content.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">{content.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {content.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
                  className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-100 transition-all">
                  Get Started →
                </motion.button>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="bg-[#0D1117] border border-white/10 rounded-2xl p-6">
                <motion.div variants={staggerParent(0.07)} initial="hidden" animate="show" className="flex flex-col gap-3">
                  {content.mockup.map((item, i) => (
                    <motion.div key={i} variants={fadeUp} className="flex items-center justify-between bg-[#161B22] border border-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${item.color}20`, color: item.color }}>
                          {item.name[0]}
                        </div>
                        <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ color: item.color, background: `${item.color}20` }}>
                        {item.status}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0A0D14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <Badge>STEPS TO USE</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              3 Steps to Kickstart
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mt-4">From setup to measurable success — effortless in three steps.</motion.p>
          </motion.div>

          <div className="flex flex-col gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={i} viewportAmount={0.25}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.3, ease: EASE }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0D1117] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
                  <div>
                    <div className="text-5xl font-black text-white/5 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.num}</div>
                    <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</h3>
                    <p className="text-slate-400 mb-5 leading-relaxed">{s.desc}</p>
                    <ul className="flex flex-col gap-2">
                      {s.points.map(p => (
                        <li key={p} className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="text-blue-400">→</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#161B22] border border-white/5 rounded-xl p-6 flex items-center justify-center min-h-[160px]">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                      className="text-6xl">{['🔐', '📁', '🚀'][i]}</motion.div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <Badge>TESTIMONIALS</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Trusted by customers
            </motion.h2>
          </motion.div>

          <Reveal viewportAmount={0.4} className="bg-[#0D1117] border border-white/10 rounded-2xl p-8 mb-6 text-center min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="text-xl text-slate-200 italic leading-relaxed mb-6">
                  "{TESTIMONIALS[testimonialIdx].quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center">
                    {TESTIMONIALS[testimonialIdx].name[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">{TESTIMONIALS[testimonialIdx].name}</div>
                    <div className="text-xs text-slate-500">{TESTIMONIALS[testimonialIdx].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          <div className="flex items-center justify-center gap-2 mb-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'bg-white w-6' : 'bg-white/20 w-2'}`} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              ‹
            </motion.button>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              ›
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-[#0A0D14]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <Badge>PRICING</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Flexible Plans for Every Team
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mt-4">Choose the plan that fits your team and scales with your business.</motion.p>

            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 mt-6">
              <button onClick={() => setBilling('monthly')}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${billing === 'monthly' ? 'text-black' : 'text-slate-400'}`}>
                {billing === 'monthly' && <motion.span layoutId="billingPill" className="absolute inset-0 bg-white rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative z-10">Monthly</span>
              </button>
              <button onClick={() => setBilling('yearly')}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${billing === 'yearly' ? 'text-black' : 'text-slate-400'}`}>
                {billing === 'yearly' && <motion.span layoutId="billingPill" className="absolute inset-0 bg-white rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative z-10">Yearly <span className="text-green-400 text-xs font-bold ml-1">30% off</span></span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerParent(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: EASE }}
                className={`relative rounded-2xl p-6 border transition-colors ${plan.highlight ? 'border-blue-500/50 bg-blue-500/5 shadow-xl shadow-blue-500/10' : 'bg-[#0D1117] border-white/5'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-[10px] font-bold text-slate-500 tracking-widest mb-2 uppercase">{plan.tag}</div>
                <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {billing === 'yearly' && plan.price !== 'Custom'
                        ? '₹' + Math.round(parseInt(plan.price.replace('₹','').replace(',','')) * 0.7).toLocaleString()
                        : plan.price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm font-normal text-slate-500 ml-1">{plan.per}</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">{plan.desc}</p>
                <div className="h-px bg-white/5 mb-5" />
                <ul className="flex flex-col gap-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-green-400 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-slate-600 mb-4">{plan.badge}</div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${plan.highlight ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <Badge>FAQ</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Curious About CallIQ?
            </motion.h2>
          </motion.div>
          <motion.div
            variants={staggerParent(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-[#0D1117] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-semibold text-white text-sm">{faq.q}</span>
                  <motion.span animate={{ rotate: activeFaq === i ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-slate-400 text-lg ml-4">+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-24 px-6 bg-[#0A0D14]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Badge>INTEGRATION</Badge>
            <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Smart Versatile Integrations
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mb-12">Connect CallIQ to your CRM, communication tools, and business apps.</motion.p>
          </motion.div>
          <motion.div
            variants={staggerParent(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INTEGRATIONS.map((tool, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.2)' }} transition={{ duration: 0.25 }}
                className="bg-[#0D1117] border border-white/5 rounded-xl p-4 text-sm text-slate-300 font-medium">
                {tool}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(59,130,246,0.08),transparent)]" />
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Step Into CallIQ —<br />
            <span className="text-slate-400">The Future of AI Calling</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 mb-10 text-lg">Everything your sales team needs, powered by AI. Launch in 3 minutes.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
              className="bg-white text-black font-bold px-10 py-4 rounded-xl hover:bg-slate-100 transition-all text-base w-full sm:w-auto">
              Get Started Free →
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('login')}
              className="bg-white/5 border border-white/10 text-white font-medium px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-base w-full sm:w-auto">
              Get in touch
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#06080F] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-xl font-black mb-4">Call<span className="text-blue-400">IQ</span></div>
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered outbound calling platform for Indian businesses.</p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Navigation</div>
              {['Home', 'Features', 'Pricing', 'How it works'].map(l => (
                <a key={l} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors mb-2">{l}</a>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Product</div>
              {['Dashboard', 'Campaigns', 'Workflow Builder', 'Results'].map(l => (
                <a key={l} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors mb-2">{l}</a>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Legal</div>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
                <a key={l} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors mb-2">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 CallIQ. All rights reserved.</p>
            <p className="text-xs text-slate-600">Built for Indian businesses 🇮🇳</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}