import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/voice`

const NAV_ITEMS = [
 
  { icon: '📋', label: 'Results' },
  
]

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const staggerParent = (stagger = 0.06, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

function Badge({ children, color = 'text-slate-400' }) {
  return (
    <motion.div variants={fadeUp} className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 ${color} text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-widest uppercase`}>
      {children}
    </motion.div>
  )
}

export default function ResultsPage({ navigate, campaign }) {
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const campaignName = campaign?.name || campaign?.campaignName || 'Campaign Results'

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
    const interval = setInterval(fetchResults, 5000)
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
    <div className="min-h-screen bg-[#06080F] text-white antialiased flex relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient background glow + dot grid — same language as LandingPage hero */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff04 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-56 bg-[#06080F]/80 backdrop-blur-xl border-r border-white/5 fixed top-0 left-0 bottom-0 flex-col z-40 hidden md:flex">
        <div
          className="px-5 py-5 border-b border-white/5 cursor-pointer select-none"
          onClick={() => navigate('landing')}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="text-xl font-black tracking-tight">Call<span className="text-blue-400">IQ</span></span>
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
      </motion.aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 p-6 md:p-10 relative z-10">

        {/* Header */}
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          animate="show"
          className="flex items-start justify-between mb-10 flex-wrap gap-4"
        >
          <div>
            <button
              onClick={() => navigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3 block"
            >
              ← Back to dashboard
            </button>
            <Badge color="text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Results
            </Badge>
            <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {campaignName}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-500 text-sm mt-1">{results.length} calls saved in database</motion.p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Calls',    value: stats.total,               icon: '📞' },
            { label: 'Completed',      value: stats.called,              icon: '✅' },
            { label: 'Failed',         value: stats.failed,              icon: '❌' },
            { label: 'Avg Duration',   value: formatDuration(stats.avgDur), icon: '⏱️' },
          ].map(s => (
            <motion.div key={s.label} variants={fadeUp} whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }} transition={{ duration: 0.25 }}
              className="rounded-2xl p-5 border bg-[#0D1117] border-white/5">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-slate-500 py-20">Loading results from database...</div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-slate-500 py-20"
          >
            Abhi koi call results nahi hain. Campaign fire karo!
          </motion.div>
        )}

        {/* Two-pane */}
        {!loading && results.length > 0 && (
          <div className="flex gap-4 items-start">

            {/* Call list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              layout
              className={`bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden flex-shrink-0 ${selected ? 'w-80' : 'flex-1'}`}
              style={{ transition: 'width 0.3s ease' }}
            >
              <motion.div variants={staggerParent(0.03)} initial="hidden" animate="show" className="max-h-[520px] overflow-y-auto">
                {results.map(r => (
                  <motion.div
                    key={r._id}
                    variants={fadeUp}
                    onClick={() => setSelected(selected?._id === r._id ? null : r)}
                    className={`flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-b-0 cursor-pointer transition-colors
                      ${selected?._id === r._id ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold flex items-center justify-center flex-shrink-0">
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
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Detail pane */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex-1 bg-[#0D1117] border border-white/5 rounded-2xl p-6 min-w-0"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
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
                      <div className="bg-[#06080F] rounded-xl p-4 max-h-48 overflow-y-auto border border-white/5">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}