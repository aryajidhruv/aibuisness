import { useState } from 'react'

const CALLS = [
  { id: 1, name: 'Rahul Sharma',  phone: '98765 43210', status: 'Interested', sentiment: 'Positive', score: 88, duration: '3:42', summary: 'Interested in the premium plan. Asked about pricing and EMI options. Wants a callback on Thursday.', topics: ['Pricing', 'EMI', 'Premium plan'], actions: ['Call back Thursday', 'Send pricing PDF'] },
  { id: 2, name: 'Meera Kapoor',  phone: '91234 56789', status: 'Callback',   sentiment: 'Neutral',  score: 55, duration: '4:15', summary: 'Currently using a competitor. Open to switching if onboarding is smooth. Requested a demo.', topics: ['Competitor', 'Demo', 'Onboarding'], actions: ['Schedule demo', 'Share case studies'] },
  { id: 3, name: 'Ankit Verma',   phone: '87654 32109', status: 'Not now',    sentiment: 'Negative', score: 22, duration: '1:18', summary: 'Not interested at this time. Budget is tight for this quarter.', topics: ['Budget', 'Timing'], actions: ['Add to Q4 pipeline'] },
  { id: 4, name: 'Divya Rao',     phone: '99887 76655', status: 'Interested', sentiment: 'Positive', score: 92, duration: '5:01', summary: 'Very enthusiastic. Wants to start immediately. Decision maker — no approvals needed.', topics: ['Immediate start', 'Decision maker'], actions: ['Send contract today', 'Assign account manager'] },
  { id: 5, name: 'Suresh Pillai', phone: '88776 65544', status: 'No answer',  sentiment: '—',        score:  0, duration: '—',    summary: 'No answer after 3 attempts.', topics: [], actions: ['Retry tomorrow'] },
  { id: 6, name: 'Kavya Singh',   phone: '77665 54433', status: 'Interested', sentiment: 'Positive', score: 79, duration: '3:58', summary: 'Looking for a team plan for 15 people. Wants volume pricing.', topics: ['Team plan', 'Volume pricing'], actions: ['Send team pricing', 'Book demo'] },
]

const STATUS_COLOR = {
  'Interested': 'text-green-400 bg-green-400/10',
  'Callback':   'text-amber-400 bg-amber-400/10',
  'Not now':    'text-red-400 bg-red-400/10',
  'No answer':  'text-slate-400 bg-slate-400/10',
}

const SENTIMENT_COLOR = {
  'Positive': 'text-green-400 bg-green-400/10',
  'Neutral':  'text-amber-400 bg-amber-400/10',
  'Negative': 'text-red-400 bg-red-400/10',
  '—':        'text-slate-400 bg-slate-400/10',
}

const SCORE_COLOR = score =>
  score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📞', label: 'Campaigns' },
  { icon: '📋', label: 'Results' },
  { icon: '⚙️', label: 'Settings' },
]

const FILTERS = ['All', 'Interested', 'Callback', 'Not now', 'No answer']

export default function ResultsPage({ navigate, campaign }) {
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)

  const campaignName = campaign?.name || campaign?.campaignName || 'Q3 Lead Qualification'
  const filtered = filter === 'All' ? CALLS : CALLS.filter(c => c.status === filter)

  const stats = {
    total:      CALLS.length,
    interested: CALLS.filter(c => c.status === 'Interested').length,
    avgScore:   Math.round(CALLS.filter(c => c.score > 0).reduce((s, c) => s + c.score, 0) / CALLS.filter(c => c.score > 0).length),
    rate:       Math.round((CALLS.filter(c => c.status === 'Interested').length / CALLS.length) * 100),
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex">

      {/* Sidebar */}
      <aside className="w-56 bg-[#0F1623] border-r border-white/5 fixed top-0 left-0 bottom-0 flex-col z-40 hidden md:flex">
        <div
          className="px-5 py-5 border-b border-white/5 cursor-pointer select-none"
          onClick={() => navigate('landing')}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="text-xl font-bold">Call<span className="text-blue-400">IQ</span></span>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              onClick={() => item.label === 'Dashboard' && navigate('dashboard')}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors
                ${item.label === 'Results'
                  ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}
            >
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 p-6 md:p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <button
              onClick={() => navigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 block"
            >
              ← Back to dashboard
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{campaignName}</h1>
            <p className="text-slate-500 text-sm mt-1">{CALLS.length} calls analysed</p>
          </div>
          <button className="border border-white/10 hover:border-white/20 text-slate-300 text-sm px-4 py-2.5 rounded-xl transition-all">
            ⬇ Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total calls',        value: stats.total,           icon: '📞', highlight: false },
            { label: 'Interested',         value: stats.interested,      icon: '🔥', highlight: true  },
            { label: 'Avg sentiment score',value: `${stats.avgScore}/100`,icon: '📈', highlight: false },
            { label: 'Conversion rate',    value: `${stats.rate}%`,       icon: '🎯', highlight: false },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 border ${s.highlight ? 'bg-green-500/5 border-green-500/20' : 'bg-[#0F1623] border-white/5'}`}>
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.highlight ? 'text-green-400' : 'text-white'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelected(null) }}
              className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-full border transition-all
                ${filter === f
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}
            >
              {f}
              <span className="bg-white/5 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">
                {f === 'All' ? CALLS.length : CALLS.filter(c => c.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Two-pane */}
        <div className="flex gap-4 items-start">

          {/* Call list */}
          <div className={`bg-[#0F1623] border border-white/5 rounded-2xl overflow-hidden flex-shrink-0 ${selected ? 'w-80' : 'flex-1'} transition-all`}>
            <div className="max-h-[520px] overflow-y-auto">
              {filtered.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-b-0 cursor-pointer transition-colors
                    ${selected?.id === c.id ? 'bg-blue-500/5' : 'hover:bg-white/[0.01]'}`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{c.phone}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[c.status]}`}>
                      {c.status}
                    </span>
                    <div className="text-[10px] text-slate-600 mt-1">{c.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail pane */}
          {selected && (
            <div className="flex-1 bg-[#0F1623] border border-white/5 rounded-2xl p-6 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selected.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{selected.phone} · {selected.duration}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-600 hover:text-slate-300 text-xl leading-none transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-6">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[selected.status]}`}>{selected.status}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SENTIMENT_COLOR[selected.sentiment]}`}>
                  {selected.sentiment} {selected.score > 0 ? `· ${selected.score}/100` : ''}
                </span>
              </div>

              {/* Summary */}
              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Summary</div>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.summary}</p>
              </div>

              {/* Topics */}
              {selected.topics.length > 0 && (
                <div className="mb-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Key topics</div>
                  <div className="flex gap-2 flex-wrap">
                    {selected.topics.map(t => (
                      <span key={t} className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Action items</div>
                <ul className="flex flex-col gap-2">
                  {selected.actions.map(a => (
                    <li key={a} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-blue-400 mt-0.5">→</span> {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Score bar */}
              {selected.score > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Sentiment score</div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${selected.score}%`, background: SCORE_COLOR(selected.score) }}
                    />
                  </div>
                  <div className="text-xs text-slate-600">{selected.score} / 100</div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}