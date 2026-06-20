import { useState } from 'react'

const STEPS = ['Business info', 'Campaign setup', 'Upload contacts']

const GOALS = [
  { id: 'lead-gen',  label: 'Lead generation',     icon: '🎯' },
  { id: 'survey',    label: 'Customer survey',      icon: '📋' },
  { id: 'reminder',  label: 'Appointment reminder', icon: '🗓️' },
  { id: 'follow-up', label: 'Sales follow-up',      icon: '🤝' },
  { id: 'feedback',  label: 'Product feedback',     icon: '💬' },
  { id: 'custom',    label: 'Custom',               icon: '⚙️' },
]

const INDUSTRIES = ['Finance', 'Healthcare', 'Real estate', 'EdTech', 'Insurance', 'E-commerce', 'SaaS', 'Other']

const LANGUAGES = [
  { value: 'hinglish', label: 'Hindi + English (Hinglish)' },
  { value: 'english',  label: 'English only' },
  { value: 'hindi',    label: 'Hindi only' },
  { value: 'tamil',    label: 'Tamil' },
  { value: 'telugu',   label: 'Telugu' },
  { value: 'marathi',  label: 'Marathi' },
]

function parseNumbers(raw) {
  return raw
    .split(/[\n,;]+/)
    .map(n => n.replace(/\D/g, ''))
    .filter(n => n.length >= 10)
    .slice(0, 5000)
}

export default function OnboardingPage({ navigate }) {
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company: '', industry: '', website: '',
    goal: '', campaignName: '', script: '', language: 'hinglish',
    numbers: '', csv: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const contactCount = parseNumbers(form.numbers + '\n' + form.csv).length

  const next = () => {
    setError('')
    if (step === 0 && !form.company.trim()) {
      setError('Company name is required.')
      return
    }
    if (step === 1 && !form.goal) {
      setError('Please select a call goal.')
      return
    }
    if (step === 1 && !form.campaignName.trim()) {
      setError('Campaign name is required.')
      return
    }
    if (step === 2 && contactCount === 0) {
      setError('Please add at least one valid phone number.')
      return
    }
    if (step < 2) {
      setStep(s => s + 1)
    } else {
      navigate('campaign', {
        ...form,
        contacts: parseNumbers(form.numbers + '\n' + form.csv),
      })
    }
  }

  const back = () => {
    setError('')
    setStep(s => s - 1)
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-16 border-b border-white/5 bg-[#080C14]/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
        <div
          onClick={() => navigate('landing')}
          className="font-display text-xl font-bold cursor-pointer select-none"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Call<span className="text-blue-400">IQ</span>
        </div>
        <button
          onClick={() => navigate('landing')}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-xl mx-auto px-6 pt-28 pb-20">

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-10 relative">
          {/* connector line */}
          <div className="absolute top-4 left-4 right-4 h-px bg-white/5" />
          <div
            className="absolute top-4 left-4 h-px bg-blue-500 transition-all duration-500"
            style={{ width: step === 0 ? '0%' : step === 1 ? '50%' : '100%' }}
          />
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${i < step  ? 'bg-green-500 text-white'
                : i === step ? 'bg-blue-500 text-white'
                :              'bg-[#0F1623] border border-white/10 text-slate-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : 'text-slate-600'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 md:p-8">

          {/* ── STEP 0: Business info ── */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Tell us about your business
              </h2>
              <p className="text-slate-500 text-sm mb-7">
                This helps us personalise the AI agent's tone and knowledge.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-400 mb-2">Company name *</label>
                <input
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="e.g. Sharma Enterprises"
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Industry</label>
                  <select
                    className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    value={form.industry}
                    onChange={e => set('industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Website (optional)</label>
                  <input
                    className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="yoursite.com"
                    value={form.website}
                    onChange={e => set('website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Campaign setup ── */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Set up your campaign
              </h2>
              <p className="text-slate-500 text-sm mb-7">Define what the AI should accomplish on each call.</p>

              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-400 mb-3">Goal of these calls *</label>
                <div className="grid grid-cols-3 gap-2">
                  {GOALS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => set('goal', g.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all
                        ${form.goal === g.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-white/5 bg-[#141C2E] text-slate-500 hover:border-white/10 hover:text-slate-300'}`}
                    >
                      <span className="text-xl">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-400 mb-2">Campaign name *</label>
                <input
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                  placeholder="e.g. Q3 Lead Qualification"
                  value={form.campaignName}
                  onChange={e => set('campaignName', e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-400 mb-2">AI agent script / instructions</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none"
                  placeholder={`Tell the AI what to say. Example:\n"Greet the person, introduce yourself from ${form.company || 'our company'}, ask if they're interested in our services, and note their response."`}
                  value={form.script}
                  onChange={e => set('script', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Call language</label>
                <select
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                  value={form.language}
                  onChange={e => set('language', e.target.value)}
                >
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: Upload contacts ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Add your contact list
              </h2>
              <p className="text-slate-500 text-sm mb-7">Paste numbers below or drop in your CSV contents.</p>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Phone numbers — one per line or comma separated
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none font-mono"
                  placeholder={'9876543210\n9123456789\n+91 98765 43210'}
                  value={form.numbers}
                  onChange={e => set('numbers', e.target.value)}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-slate-600">or paste CSV contents</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-slate-400 mb-2">CSV contents</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#141C2E] border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-all resize-none font-mono"
                  placeholder={'name,phone\nRahul Sharma,9876543210\nMeera Kapoor,9123456789'}
                  value={form.csv}
                  onChange={e => set('csv', e.target.value)}
                />
              </div>

              {contactCount > 0 && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-2.5 rounded-xl">
                  <span>✓</span>
                  <span>{contactCount} valid number{contactCount !== 1 ? 's' : ''} detected</span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
            {step > 0 && (
              <button
                onClick={back}
                className="border border-white/10 hover:border-white/20 text-slate-300 px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5"
            >
              {step === 2 ? 'Launch campaign →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}