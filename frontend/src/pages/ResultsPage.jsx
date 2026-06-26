import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:5001/api/voice'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📞', label: 'Campaigns' },
  { icon: '📋', label: 'Results' },
  { icon: '⚙️', label: 'Settings' },
]

export default function ResultsPage({ navigate, campaign }) {
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const campaignName = campaign?.name || campaign?.campaignName || 'Campaign Results'

  // ✅ MongoDB se real data fetch
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${API_BASE}/results`)
        if (res.data.success) setResults(res.data.results)
      } catch (err) {
        console.error('Results fetch failed:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
    const interval = setInterval(fetchResults, 5000) // har 5 sec refresh
    return () => clearInterval(interval)
  }, [])

  const stats = {
    total:    results.length,
    called:   results.filter(r => r.status === 'called').length,
    failed:   results.filter(r => r.status === 'failed').length,
    avgDur:   results.filter(r => r.duration).length
      ? Math.round(results.filter(r => r.duration).reduce((s, r) => s + r.duration, 0) / results.filter(r => r.duration).length)
      : 0
  }

  const formatDuration = (sec) => {
    if (!sec) return '—'
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
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
            <p className="text-slate-500 text-sm mt-1">{results.length} calls saved in database</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Calls',    value: stats.total,               icon: '📞' },
            { label: 'Completed',      value: stats.called,              icon: '✅' },
            { label: 'Failed',         value: stats.failed,              icon: '❌' },
            { label: 'Avg Duration',   value: formatDuration(stats.avgDur), icon: '⏱️' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border bg-[#0F1623] border-white/5">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-slate-500 py-20">Loading results from database...</div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div className="text-center text-slate-500 py-20">
            Abhi koi call results nahi hain. Campaign fire karo!
          </div>
        )}

        {/* Two-pane */}
        {!loading && results.length > 0 && (
          <div className="flex gap-4 items-start">

            {/* Call list */}
            <div className={`bg-[#0F1623] border border-white/5 rounded-2xl overflow-hidden flex-shrink-0 ${selected ? 'w-80' : 'flex-1'} transition-all`}>
              <div className="max-h-[520px] overflow-y-auto">
                {results.map(r => (
                  <div
                    key={r._id}
                    onClick={() => setSelected(selected?._id === r._id ? null : r)}
                    className={`flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-b-0 cursor-pointer transition-colors
                      ${selected?._id === r._id ? 'bg-blue-500/5' : 'hover:bg-white/[0.01]'}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-300 text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {(r.customerName || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.customerName || 'Unknown'}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{r.phone}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        r.status === 'called' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>
                        {r.status}
                      </span>
                      <div className="text-[10px] text-slate-600 mt-1">{formatDuration(r.duration)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail pane */}
            {selected && (
              <div className="flex-1 bg-[#0F1623] border border-white/5 rounded-2xl p-6 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {selected.customerName || 'Unknown'}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {selected.phone} · {formatDuration(selected.duration)}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-300 text-xl leading-none">✕</button>
                </div>

                {/* Status + Ended Reason */}
                <div className="flex gap-2 flex-wrap mb-6">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    selected.status === 'called' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                  }`}>{selected.status}</span>
                  {selected.endedReason && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-slate-400 bg-slate-400/10">
                      {selected.endedReason}
                    </span>
                  )}
                </div>

                {/* Summary */}
                {selected.summary && (
                  <div className="mb-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">AI Summary</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{selected.summary}</p>
                  </div>
                )}

                {/* Transcript */}
                {selected.transcript && (
                  <div className="mb-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Transcript</div>
                    <div className="bg-[#080C14] rounded-xl p-4 max-h-48 overflow-y-auto">
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{selected.transcript}</p>
                    </div>
                  </div>
                )}

                {/* Recording */}
                {selected.recordingUrl && (
                  <div className="mb-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Recording</div>
                    <audio controls src={selected.recordingUrl} className="w-full" style={{ filter: 'invert(1)' }} />
                  </div>
                )}

                {/* Call ID */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Call ID</div>
                  <div className="text-xs text-slate-600 font-mono">{selected.callId}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}