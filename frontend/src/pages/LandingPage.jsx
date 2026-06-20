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
    <div className="min-h-screen bg-[#080C14] text-white font-body antialiased selection:bg-blue-500/30">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-20 transition-all duration-300 ${scrolled ? 'bg-[#080C14]/90 border-b border-white/5 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-display text-2xl font-bold cursor-pointer select-none tracking-tight">
          Call<span className="text-blue-400">IQ</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {['How it works', 'Features', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
               className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              {l}
            </a>
          ))}
          <button onClick={() => navigate('login')} className="text-sm text-slate-300 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all ml-2 hover:bg-white/[0.02]">
            Log in
          </button>
          <button onClick={() => navigate('onboarding')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-all font-semibold shadow-md shadow-blue-500/10">
            Start free
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMenuOpen(o => !o)}>
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-transform ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-[#0F1623]/95 border-b border-white/5 backdrop-blur-xl flex flex-col p-6 gap-3 md:hidden">
          {['How it works', 'Features', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
               onClick={() => setMenuOpen(false)}
               className="text-sm font-medium text-slate-300 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all">
              {l}
            </a>
          ))}
          <div className="h-px bg-white/5 my-1" />
          <button onClick={() => { setMenuOpen(false); navigate('login'); }} className="text-sm text-slate-300 border border-white/10 px-4 py-3 rounded-xl text-center font-medium">
            Log in
          </button>
          <button onClick={() => { setMenuOpen(false); navigate('onboarding'); }} className="text-sm bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold text-center">
            Start free
          </button>
        </div>
      )}

      {/* ── NEW SPLIT GRID HERO ── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Background Mesh Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.2),transparent_60%)]" />

        <div className="relative container mx-auto max-w-6xl px-6 md:px-12 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            
            {/* Left Column: Text Info Content */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex self-start items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                AI Calling Platform for Indian Businesses
              </div>

              <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white">
                Your AI agent<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  calls. converses. converts.
                </span>
              </h1>

              <p className="text-slate-400 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                Give CallIQ your contact list and your goal. It calls every number, holds real custom two-way conversations, and analyzes sentiments on the fly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button onClick={() => navigate('onboarding')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-center text-sm">
                  Launch Free Campaign →
                </button>
                <button onClick={() => navigate('login')} className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl transition-all font-medium hover:bg-white/[0.02] text-center text-sm">
                  Demo Dashboard
                </button>
              </div>

              {/* Stats Block Inside Hero Content */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                {STATS.map(s => (
                  <div key={s.num}>
                    <div className="font-display text-2xl font-black text-white">{s.num}</div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Dashboard Mockup Front & Center */}
            <div className="lg:col-span-6 w-full">
              <div className="relative mx-auto rounded-2xl border border-white/10 overflow-hidden bg-[#0F1623] shadow-2xl shadow-black/90 group transition-all duration-300 hover:border-white/20">
                {/* Window Top Control Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#141C2E] border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono tracking-tight">calliq.in/live-tracking</span>
                  <div className="w-10"></div>
                </div>

                <div className="flex min-h-[280px]">
                  {/* Side tabs mockup */}
                  <div className="w-28 bg-white/[0.01] border-r border-white/5 py-4 hidden sm:block">
                    {['Dashboard','Campaigns','Results','Settings'].map(item => (
                      <div key={item} className={`px-4 py-2 text-[11px] font-bold ${item === 'Campaigns' ? 'text-blue-400 bg-blue-500/10 border-l-2 border-blue-500' : 'text-slate-600'}`}>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content inside layout mockup */}
                  <div className="flex-1 p-5 bg-[#0F1623]">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        ['1,240', 'Total Made'],
                        ['83%', 'Answered'],
                        ['342', 'Hot Leads']
                      ].map(([n, l]) => (
                        <div key={l} className="bg-[#141C2E] border border-white/5 rounded-xl p-3">
                          <div className="font-display text-base font-black text-white tracking-tight">{n}</div>
                          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">{l}</div>
                        </div>
                      ))}
                    </div>

                    {/* Simulation Live Tracking Cards */}
                    <div className="flex flex-col gap-2">
                      {[
                        { name:'Rahul S.', status:'Interested', color:'text-green-400 bg-green-400/10 border-green-500/20' },
                        { name:'Meera K.', status:'Callback',   color:'text-amber-400 bg-amber-400/10 border-amber-500/20' },
                        { name:'Ankit V.', status:'Not Now', color:'text-red-400 bg-red-400/10 border-red-500/20' },
                      ].map(c => (
                        <div key={c.name} className="flex items-center justify-between bg-[#141C2E]/60 border border-white/5 rounded-xl px-4 py-2.5 hover:bg-[#141C2E] transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                              {c.name[0]}
                            </div>
                            <span className="text-xs font-semibold text-slate-300">{c.name}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.color}`}>{c.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              How it works
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">From contact list to results<br />in under 5 minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="text-xs font-bold text-blue-400/60 font-mono mb-3">{String(i+1).padStart(2,'0')}</div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-bold text-white mb-2 text-base tracking-tight">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-[#0A0E1A] relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Everything you need to<br />run AI outreach at scale</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Businesses that switched to CallIQ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-4xl text-blue-400/30 font-serif leading-none mb-3">"</div>
                  <p className="text-slate-300 text-sm italic leading-relaxed mb-6">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{t.role}</div>
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
          <div className="text-center mb-16">
            <div className="inline-flex bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              Pricing
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-3 text-sm">No setup fees. No hidden charges. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border transition-all duration-300 ${plan.highlight ? 'border-blue-500 bg-blue-500/5 shadow-xl shadow-blue-500/5 md:scale-105' : 'bg-[#0F1623] border-white/5'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most popular
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{plan.name}</div>
                <div className="font-display text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {plan.price}<span className="text-sm font-normal text-slate-500 ml-1">{plan.per}</span>
                </div>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">{plan.desc}</p>
                <div className="h-px bg-white/5 mb-5" />
                <ul className="flex flex-col gap-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="text-green-400 font-bold text-xs mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('onboarding')}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'border border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/[0.01]'}`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 border-y border-white/5 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_70%)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Ready to let AI make your calls?</h2>
          <p className="text-slate-400 mb-8 text-sm md:text-base">Set up a campaign in 3 minutes. No credit card required.</p>
          <button onClick={() => navigate('onboarding')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 text-base">
            Launch your first campaign →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-white/5 bg-[#060910]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-display text-lg font-bold tracking-tight">Call<span className="text-blue-400">IQ</span></div>
          <p className="text-xs text-slate-600 font-medium">© 2026 CallIQ. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}