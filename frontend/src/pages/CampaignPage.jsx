import { useState, useEffect } from 'react'

const NAMES = ['Rahul S.', 'Meera K.', 'Ankit V.', 'Divya R.', 'Suresh P.', 'Kavya S.', 'Priya M.', 'Ravi B.', 'Sonal T.', 'Arun N.']
const STATUSES = ['Interested', 'Callback', 'Not now', 'No answer', 'Interested', 'Interested']

const STATUS_COLOR = {
  'Interested': 'text-green-400 bg-green-400/10',
  'Callback':   'text-amber-400 bg-amber-400/10',
  'Not now':    'text-red-400 bg-red-400/10',
  'No answer':  'text-slate-400 bg-slate-400/10',
}

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📞', label: 'Campaigns' },
  { icon: '📋', label: 'Results' },
  { icon: '⚙️', label: 'Settings' },
]

export default function CampaignPage({ navigate, campaign }) {
  const total   = campaign?.contacts?.length || 120
  const [called,  setCalled]  = useState(0)
  const [leads,   setLeads]   = useState(0)
  const [running, setRunning] = useState(false)
  const [feed,    setFeed]    = useState([])

  useEffect(() => {
    if (!running || called >= total) return
    const t = setInterval(() => {
      setCalled(c => {
        if (c >= total) { setRunning(false); return c }
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]
        const name   = NAMES[Math.floor(Math.random() * NAMES.length)]
        if (status === 'Interested') setLeads(l => l + 1)
        setFeed(f => [{ id: Date.now(), name, status }, ...f.slice(0, 24)])
        return c + 1
      })
    }, 500)
    return () => clearInterval(t)
  }, [running, called, total])

  const pct      = total > 0 ? Math.round((called / total) * 100) : 0
  const answered = Math.round(called * 0.83)

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
                ${item.label === 'Campaigns'
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
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {campaign?.campaignName || 'New Campaign'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {total.toLocaleString()} contacts · {campaign?.language || 'Hinglish'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {called > 0 && (
              <button
                onClick={() => navigate('results', campaign)}
                className="border border-white/10 hover:border-white/20 text-slate-300 text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                View results →
              </button>
            )}
            <button
              onClick={() => { if (called < total) setRunning(r => !r) }}
              disabled={called >= total}
              className={`text-sm font-medium px-5 py-2.5 rounded-xl transition-all
                ${called >= total
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
                  : running
                  ? 'border border-white/10 hover:border-white/20 text-slate-300'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5'}`}
            >
              {called >= total ? '✓ Completed' : running ? '⏸ Pause' : called > 0 ? '▶ Resume' : '▶ Start campaign'}
            </button>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{pct}%</span>
            <span className="text-slate-500 text-sm">{called.toLocaleString()} / {total.toLocaleString()} calls</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            {running ? (
              <span className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse-dot 1.5s infinite' }} />
                Live
              </span>
            ) : called >= total ? (
              <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full">✓ Completed</span>
            ) : (
              <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">⏸ Paused</span>
            )}
            <span className="text-xs text-slate-600">
              {running && called < total ? `~${Math.max(1, Math.round(((total - called) * 0.5) / 60))} min remaining` : ''}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Called',     value: called.toLocaleString(),                icon: '📞' },
            { label: 'Answered',   value: answered.toLocaleString(),              icon: '✅' },
            { label: 'Interested', value: leads.toLocaleString(),                 icon: '🔥' },
            { label: 'Remaining',  value: Math.max(0, total - called).toLocaleString(), icon: '⏳' },
          ].map(s => (
            <div key={s.label} className="bg-[#0F1623] border border-white/5 rounded-2xl p-5">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live feed */}
        <div className="bg-[#0F1623] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live call feed</h2>
            {running && (
              <span className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse-dot 1.5s infinite' }} />
                Live
              </span>
            )}
          </div>

          {feed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 text-sm">
              {called >= total
                ? <><p>Campaign complete.</p><button onClick={() => navigate('results', campaign)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl transition-all">View full results →</button></>
                : <p>Press Start to begin calling.</p>}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {feed.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-6 py-3 border-b border-white/5 last:border-b-0" style={{ animation: 'fadeUp 0.3s ease both' }}>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-slate-600">just now</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[item.status]}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}