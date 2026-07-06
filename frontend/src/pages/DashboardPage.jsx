import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

const STATUS_COLOR = {
  running:   'text-green-400 bg-green-400/10',
  completed: 'text-blue-400 bg-blue-400/10',
  scheduled: 'text-amber-400 bg-amber-400/10',
  called:    'text-green-400 bg-green-400/10',
  failed:    'text-red-400 bg-red-400/10',
}

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',         target: 'dashboard' },
  { icon: '🔀', label: 'Workflow Builder',   target: 'workflow' },
  { icon: '📞', label: 'Twilio Auto-Dialer', target: 'dialer' },
  { icon: '📋', label: 'Results',            target: 'results' },
  
]

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const staggerParent = (stagger = 0.08, delay = 0) => ({
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

export default function DashboardPage({ navigate, campaign }) {
  const [stats, setStats]       = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/dashboard/stats`, {
          withCredentials: true
        })
        if (res.data.success) setStats(res.data.stats)
      } catch (err) {
        console.error('Dashboard stats fetch failed:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const recentCalls = stats?.recentCalls || []
  const newCampaignRow = campaign ? [{
    id: 99,
    customerName: campaign.campaignName || 'New Campaign',
    phone: `${campaign.contacts?.length || 0} contacts`,
    status: 'scheduled',
    endedReason: campaign.goal || 'Custom',
    createdAt: new Date().toISOString()
  }] : []

  const allRows = [...newCampaignRow, ...recentCalls]

  const statCards = [
    { label: 'Total contacts', value: stats?.totalCalls || 0,  icon: '👥' },
    { label: 'Calls made',     value: stats?.totalCalls || 0,  icon: '📞' },
    { label: 'Answered',       value: stats?.called || 0,      icon: '✅' },
    { label: 'Hot leads',      value: stats?.called || 0,      icon: '🔥' },
  ]

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE}/api/auth/logout`, { withCredentials: true })
    } catch (e) {}
    navigate('landing')
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
        className="w-56 bg-[#06080F]/80 backdrop-blur-xl border-r border-white/5 fixed top-0 left-0 bottom-0 flex flex-col z-40 hidden md:flex">
        <div className="px-5 py-5 border-b border-white/5 cursor-pointer select-none"
          onClick={() => navigate('landing')} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="text-xl font-black tracking-tight">Call<span className="text-blue-400">IQ</span></span>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <div key={item.label}
              onClick={() => item.target && navigate(item.target)}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors
                ${item.label === 'Dashboard'
                  ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/5 py-3">
          <div onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-500 hover:text-red-400 cursor-pointer transition-colors">
            <span>🚪</span> Log out
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 p-6 md:p-10 relative z-10">

        {/* Header */}
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <Badge color="text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Overview
            </Badge>
            <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Dashboard
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-500 text-sm mt-1">Welcome back — here's your overview</motion.p>
          </div>
          <motion.div variants={fadeUp} className="flex gap-3">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('workflow')}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              🔀 Build Workflow
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('onboarding')}
              className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              + New Campaign
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 animate-pulse">
                <div className="w-8 h-8 bg-white/5 rounded-lg mb-3" />
                <div className="w-16 h-6 bg-white/5 rounded mb-2" />
                <div className="w-24 h-3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerParent()}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map(s => (
              <motion.div key={s.label} variants={fadeUp} whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }} transition={{ duration: 0.25 }}
                className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {s.value.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recent Calls Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Recent Calls</h2>
            <div className="flex gap-2">
              <button onClick={() => navigate('results')}
                className="text-xs border border-white/10 hover:border-white/20 text-slate-400 px-3 py-1.5 rounded-lg transition-all">
                View All →
              </button>
              <button onClick={() => navigate('onboarding')}
                className="text-xs border border-white/10 hover:border-white/20 text-slate-400 px-3 py-1.5 rounded-lg transition-all">
                + New
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-600 text-sm">
              Loading...
            </div>
          ) : allRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 text-sm gap-3">
              <p>Abhi koi calls nahi hain.</p>
              <button onClick={() => navigate('onboarding')}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg transition-all">
                Launch First Campaign →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Name', 'Phone', 'Status', 'Reason', 'Date', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody
                  variants={staggerParent(0.04)}
                  initial="hidden"
                  animate="show"
                >
                  {allRows.map((row, i) => (
                    <motion.tr key={row._id || row.id || i}
                      variants={fadeUp}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center">
                            {(row.customerName || 'C')[0]}
                          </div>
                          <span className="font-medium text-white">{row.customerName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{row.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[row.status] || 'text-slate-400 bg-slate-400/10'}`}>
                          {row.status || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{row.endedReason || '—'}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => navigate('results')}
                          className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                          View →
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}