import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

const STATUS_COLOR = {
  'queued':      'text-amber-400 bg-amber-400/10',
  'called':      'text-green-400 bg-green-400/10',
  'failed':      'text-red-400 bg-red-400/10',
  'pending':     'text-slate-400 bg-slate-400/10',
  'ringing':     'text-blue-400 bg-blue-400/10',
  'in-progress': 'text-blue-400 bg-blue-400/10',
}

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📞', label: 'Campaigns' },
  { icon: '📋', label: 'Results' },
  { icon: '⚙️', label: 'Settings' },
]

export default function CampaignPage({ navigate, campaign }) {
  const [leads, setLeads] = useState([])
  const [started, setStarted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const total      = leads.length || campaign?.contacts?.length || 0
  const called     = leads.filter(l => l.status === 'called').length
  const failed     = leads.filter(l => l.status === 'failed').length
  const queued     = leads.filter(l => l.status === 'queued').length
  const pct        = total > 0 ? Math.round(((called + failed) / total) * 100) : 0
  const isComplete = started && total > 0 && queued === 0 && (called + failed) === total

  // ✅ Har 3 sec mein real status fetch
  useEffect(() => {
    if (!started) return
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/voice/leads`)
        if (res.data.success) setLeads(res.data.leads)
      } catch (e) { console.error(e) }
    }, 3000)
    return () => clearInterval(interval)
  }, [started])

  const handleStart = async () => {
    setError('')
    setUploading(true)

    try {
      // ✅ CSV content build karo — naam + phone dono sahi se
      let csvContent = ''

      if (campaign?.csv?.trim()) {
        // User ne CSV format diya — name,phone
        csvContent = campaign.csv.trim().startsWith('name,')
          ? campaign.csv.trim()
          : 'name,phone\n' + campaign.csv.trim()
      } else if (campaign?.contacts?.length > 0) {
        // Sirf numbers hain — +91 prefix add karo
        csvContent = 'name,phone\n' +
          campaign.contacts.map((phone, i) => {
            const cleaned = phone.replace(/\D/g, '')
            const formatted = cleaned.length === 10 ? `+91${cleaned}` : `+${cleaned}`
            return `Contact${i + 1},${formatted}`
          }).join('\n')
      } else {
        setError('Koi contacts nahi mile!')
        setUploading(false)
        return
      }

      // ✅ CSV file banao aur upload karo
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'contacts.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await axios.post(`${API_BASE}/api/voice/upload`, formData)
      setLeads(uploadRes.data.leads)

      // ✅ Vapi calls fire karo
      await axios.post(`${API_BASE}/api/voice/run-campaign`, {
        scriptTemplate: `Hi {{firstName}}, ${campaign?.company || 'CallIQ'} ki taraf se call kar raha hoon.`,
        systemPrompt: campaign?.script || '',
        language: campaign?.language || 'Hindi'
      })

      setStarted(true)

      // Fresh leads fetch
      const leadsRes = await axios.get(`${API_BASE}/api/voice/leads`)
      if (leadsRes.data.success) setLeads(leadsRes.data.leads)

    } catch (err) {
      setError('Campaign start nahi ho saka: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex">

      {/* Sidebar */}
      <aside className="w-56 bg-[#0F1623] border-r border-white/5 fixed top-0 left-0 bottom-0 flex-col z-40 hidden md:flex">
        <div className="px-5 py-5 border-b border-white/5 cursor-pointer select-none"
          onClick={() => navigate('landing')} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="text-xl font-bold">Call<span className="text-blue-400">IQ</span></span>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <div key={item.label}
              onClick={() => item.label === 'Dashboard' && navigate('dashboard')}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors
                ${item.label === 'Campaigns'
                  ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}>
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
            <button onClick={() => navigate('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 block">
              ← Back to dashboard
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {campaign?.campaignName || 'New Campaign'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {total} contacts · {campaign?.language || 'Hinglish'} · {campaign?.company || ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {started && (
              <button onClick={() => navigate('results', campaign)}
                className="border border-white/10 hover:border-white/20 text-slate-300 text-sm px-4 py-2.5 rounded-xl transition-all">
                View results →
              </button>
            )}
            {!started ? (
              <button onClick={handleStart} disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50">
                {uploading ? '⏳ Starting...' : '▶ Start Campaign'}
              </button>
            ) : isComplete ? (
              <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-sm px-4 py-2.5 rounded-xl">
                ✓ Completed
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm px-4 py-2.5 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Progress */}
        <div className="bg-[#0F1623] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{pct}%</span>
            <span className="text-slate-500 text-sm">{called + failed} / {total} calls done</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',  value: total,  icon: '👥' },
            { label: 'Queued', value: queued, icon: '⏳' },
            { label: 'Called', value: called, icon: '✅' },
            { label: 'Failed', value: failed, icon: '❌' },
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
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live Call Feed</h2>
            {started && !isComplete && (
              <span className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            )}
          </div>

          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 text-sm">
              {!started ? <p>Press Start to begin calling.</p> : <p>Leads load ho rahe hain...</p>}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {leads.map(lead => (
                <div key={lead.id} className="flex items-center gap-3 px-6 py-3 border-b border-white/5 last:border-b-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {lead.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{lead.name}</div>
                    <div className="text-xs text-slate-600">{lead.phone}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[lead.status] || 'text-slate-400 bg-slate-400/10'}`}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isComplete && (
            <div className="flex flex-col items-center py-8 gap-3">
              <p className="text-green-400 text-sm font-medium">🎉 Campaign complete!</p>
              <button onClick={() => navigate('results', campaign)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl transition-all">
                View Full Results →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}