import { useState, useEffect } from 'react'

const STATS = [
  { num: '10x',   label: 'faster outreach' },
  { num: '94%',   label: 'call completion rate' },
  { num: '3 min', label: 'to launch a campaign' },
]

const STEPS = [
  { icon: '🏢', title: 'Tell us about your business', desc: 'Share your company details, goal of calls, and what the AI should say.' },
  { icon: '📋', title: 'Upload your contact list',    desc: 'Paste numbers or upload a CSV. We handle duplicates and invalid numbers.' },
  { icon: '🤖', title: 'AI calls and converses',      desc: 'Your AI agent dials every number, holds a real two-way conversation.' },
  { icon: '📊', title: 'Get instant results',         desc: 'Every call is transcribed, analysed for sentiment, and summarised.' },
]

const FEATURES = [
  { icon: '🗣️', title: 'Real conversations, not scripts', desc: 'Your AI listens and responds naturally — not a robocall, but a genuine dialogue.' },
  { icon: '📈', title: 'Live campaign tracker',           desc: 'Watch calls happen in real time. See who answered, who is interested.' },
  { icon: '🎯', title: 'Smart sentiment analysis',       desc: 'Every call is scored for sentiment and lead quality automatically.' },
  { icon: '📝', title: 'Full call transcripts',          desc: 'Every word, searchable and downloadable. Know what was said on every call.' },
  { icon: '⚡', title: 'Parallel dialling',              desc: 'Run hundreds of simultaneous calls. 1,000 contacts done in under an hour.' },
  { icon: '🔒', title: 'Compliant by default',           desc: 'Built-in DNC checks, call time limits, and opt-out handling included.' },
]

const PLANS = [
  {
    name: 'Starter', price: '₹1,999', per: '/mo',
    desc: 'For businesses testing AI calling',
    features: ['500 calls / month', 'Basic sentiment analysis', 'CSV upload', 'Email support'],
    highlight: false,
  },
  {
    name: 'Growth', price: '₹5,999', per: '/mo',
    desc: 'For teams running regular campaigns',
    features: ['2,500 calls / month', 'Full AI analysis', 'Live dashboard', 'Priority support', 'Custom scripts'],
    highlight: true,
  },
  {
    name: 'Enterprise', price: 'Custom', per: '',
    desc: 'For high-volume outreach at scale',
    features: ['Unlimited calls', 'Dedicated AI model', 'API access', 'SLA + onboarding', 'White-label option'],
    highlight: false,
  },
]

const TESTIMONIALS = [
  { quote: 'We used to have 8 people making calls all day. Now CallIQ handles 5x the volume overnight.', name: 'Rohan Mehta', role: 'VP Sales, FinEdge' },
  { quote: 'The sentiment scores alone saved us hours of manual lead qualification every week.', name: 'Priya Sharma', role: 'Growth Lead, Bharat Health' },
  { quote: 'Set up a 1,200-contact campaign in 10 minutes. Results were in the dashboard by morning.', name: 'Arjun Nair', role: 'Founder, QuickServe' },
]

export default function LandingPage({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen bg-[#080C14] text-white font-body">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 transition-all ${scrolled ? 'bg-[#080C14]/95 border-b border-white/5 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div onClick={() => window.scrollTo(0,0)} className="font-display text-xl font-bold cursor-pointer select-none">
          Call<span className="text-blue-400">IQ</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {['How it works', 'Features', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
               className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors">
              {l}
            </a>
          ))}
          {/* 1. Desktop Login Button -> 'login' route par bhejega */}
          <button onClick={() => navigate('login')} className="text-sm text-slate-300 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-all ml-2">
            Log in
          </button>
          <button onClick={() => navigate('onboarding')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all font-medium">
            Start free
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(o => !o)}>
          <span className="block w-5 h-0.5 bg-slate-400 rounded" />
          <span className="block w-5 h-0.5 bg-slate-400 rounded" />
          <span className="block w-5 h-0.5 bg-slate-400 rounded" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0F1623] border-b border-white/5 flex flex-col p-4 gap-2 md:hidden">
          {['How it works', 'Features', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
               onClick={() => setMenuOpen(false)}
               className="text-sm text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
              {l}
            </a>
          ))}
          {/* 2. UPDATED: Mobile Login Button ko bhi 'login' page par route kiya */}
          <button 
            onClick={() => { setMenuOpen(false); navigate('login'); }} 
            className="text-sm text-slate-300 border border-white/10 px-4 py-2 rounded-lg mt-1 text-left"
          >
            Log in
          </button>
          <button onClick={() => { setMenuOpen(false); navigate('onboarding'); }} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-left">Start free</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden grid-bg">
        {/* radial fade on grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_40%,#080C14_100%)]" />

        <div className="relative container mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            AI calling platform for Indian businesses
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Your AI agent<br />
            <span className="text-gradient">calls. converses. converts.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Give CallIQ your contact list and your goal. It calls every number, holds real conversations, and delivers results.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <button onClick={() => navigate('onboarding')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-base">
              Launch your first campaign →
            </button>
            <button onClick={() => navigate('dashboard')} className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl transition-all text-base">
              See demo dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center divide-x divide-white/5 mb-16">
            {STATS.map(s => (
              <div key={s.num} className="px-8 md:px-12">
                <div className="font-display text-2xl md:text-3xl font-bold text-white">{s.num}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="max-w-2xl mx-auto rounded-2xl border border-white/8 overflow-hidden bg-[#0F1623] shadow-2xl shadow-black/60">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#141C2E] border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="text-xs text-slate-600 ml-2 font-mono">calliq.in/dashboard</span>
            </div>
            <div className="flex min-h-[220px]">
              {/* Sidebar */}
              <div className="w-28 bg-white/[0.02] border-r border-white/5 py-4 hidden sm:block">
                {['Dashboard','Campaigns','Results','Settings'].map(item => (
                  <div key={item} className={`px-4 py-2 text-xs ${item === 'Campaigns' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600'}`}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['1,240','Calls made'],['83%','Answered'],['342','Hot leads']].map(([n, l]) => (
                    <div key={l} className="bg-[#141C2E] border border-white/5 rounded-lg p-2.5">
                      <div className="font-display text-base font-bold text-white">{n}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { name:'Rahul S.', status:'Interested', color:'text-green-400 bg-green-400/10' },
                    { name:'Meera K.', status:'Callback',   color:'text-amber-400 bg-amber-400/10' },
                    { name:'Ankit V.', status:'Not now',    color:'text-red-400 bg-red-400/10' },
                    { name:'Divya R.', status:'Interested', color:'text-green-400 bg-green-400/10' },
                  ].map(c => (
                    <div key={c.name} className="flex items-center gap-3 bg-[#141C2E] border border-white/5 rounded-lg px-3 py-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="text-xs text-slate-300 flex-1">{c.name}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${c.color}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              How it works
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">From contact list to results<br />in under 5 minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 hover:border-blue-500/20 rounded-2xl p-6 transition-colors">
                <div className="text-xs font-bold text-blue-400/60 font-mono mb-3">{String(i+1).padStart(2,'0')}</div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2 text-base">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-[#0A0E1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Everything you need to<br />run AI outreach at scale</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 hover:border-blue-500/20 rounded-2xl p-6 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Businesses that switched to CallIQ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 rounded-2xl p-6">
                <div className="text-4xl text-blue-400/30 font-serif leading-none mb-3">"</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-[#0A0E1A]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Pricing
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="text-slate-500 mt-3">No setup fees. No hidden charges. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border ${plan.highlight ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' : 'bg-[#0F1623] border-white/5'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                    Most popular
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{plan.name}</div>
                <div className="font-display text-3xl font-bold text-white mb-1">
                  {plan.price}<span className="text-base font-normal text-slate-500">{plan.per}</span>
                </div>
                <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>
                <div className="h-px bg-white/5 mb-5" />
                <ul className="flex flex-col gap-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-green-400 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('onboarding')}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${plan.highlight ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border border-white/10 hover:border-white/20 text-slate-300'}`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 border-y border-white/5 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(59,130,246,0.07)_0%,transparent_70%)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to let AI make your calls?</h2>
          <p className="text-slate-400 mb-8">Set up a campaign in 3 minutes. No credit card required.</p>
          <button onClick={() => navigate('onboarding')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 text-base">
            Launch your first campaign →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg font-bold">Call<span className="text-blue-400">IQ</span></div>
          <p className="text-xs text-slate-600">© 2025 CallIQ. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}