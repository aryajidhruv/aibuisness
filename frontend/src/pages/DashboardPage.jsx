const MOCK_CAMPAIGNS = [
    { id: 1, name: 'Q3 Lead Qualification',  goal: 'Lead generation', contacts: 1240, called: 1108, answered: 921,  leads: 312, status: 'completed', date: '12 Jun 2025' },
    { id: 2, name: 'Insurance Renewal Drive', goal: 'Follow-up',       contacts: 540,  called: 320,  answered: 288,  leads: 134, status: 'running',   date: '14 Jun 2025' },
    { id: 3, name: 'Product Feedback Survey', goal: 'Survey',          contacts: 800,  called: 0,    answered: 0,    leads: 0,   status: 'scheduled', date: '16 Jun 2025' },
  ]
  
  const STATUS = {
    running:   'text-green-400 bg-green-400/10',
    completed: 'text-blue-400 bg-blue-400/10',
    scheduled: 'text-amber-400 bg-amber-400/10',
  }
  
  const NAV_ITEMS = [
    { icon: '📊', label: 'Dashboard' },
    { icon: '📞', label: 'Campaigns' },
    { icon: '📋', label: 'Results' },
    { icon: '⚙️', label: 'Settings' },
  ]
  
  export default function DashboardPage({ navigate, campaign }) {
    const campaigns = campaign
      ? [{ id: 99, name: campaign.campaignName || 'New Campaign', goal: campaign.goal || 'Custom', contacts: campaign.contacts?.length || 0, called: 0, answered: 0, leads: 0, status: 'scheduled', date: 'Today' }, ...MOCK_CAMPAIGNS]
      : MOCK_CAMPAIGNS
  
    const totals = {
      contacts: campaigns.reduce((s, c) => s + c.contacts, 0),
      called:   campaigns.reduce((s, c) => s + c.called,   0),
      answered: campaigns.reduce((s, c) => s + c.answered, 0),
      leads:    campaigns.reduce((s, c) => s + c.leads,    0),
    }
  
    return (
      <div className="min-h-screen bg-[#080C14] text-white flex">
  
        {/* Sidebar */}
        <aside className="w-56 bg-[#0F1623] border-r border-white/5 fixed top-0 left-0 bottom-0 flex flex-col z-40 hidden md:flex">
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
                onClick={() => item.label === 'Results' && navigate('results')}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-colors
                  ${item.label === 'Dashboard'
                    ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}`}
              >
                <span>{item.icon}</span>{item.label}
              </div>
            ))}
          </nav>
          <div className="border-t border-white/5 py-3">
            <div
              onClick={() => navigate('landing')}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
            >
              <span>🚪</span> Log out
            </div>
          </div>
        </aside>
  
        {/* Main */}
        <main className="flex-1 md:ml-56 p-6 md:p-8">
  
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">Welcome back — here's your overview</p>
            </div>
            <button
              onClick={() => navigate('onboarding')}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
            >
              + New campaign
            </button>
          </div>
  
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total contacts', value: totals.contacts.toLocaleString(), icon: '👥' },
              { label: 'Calls made',     value: totals.called.toLocaleString(),   icon: '📞' },
              { label: 'Answered',       value: totals.answered.toLocaleString(), icon: '✅' },
              { label: 'Hot leads',      value: totals.leads.toLocaleString(),    icon: '🔥' },
            ].map(s => (
              <div key={s.label} className="bg-[#0F1623] border border-white/5 rounded-2xl p-5">
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
  
          {/* Campaigns table */}
          <div className="bg-[#0F1623] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your campaigns</h2>
              <button
                onClick={() => navigate('onboarding')}
                className="text-xs border border-white/10 hover:border-white/20 text-slate-400 px-3 py-1.5 rounded-lg transition-all"
              >
                + New
              </button>
            </div>
  
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Campaign', 'Contacts', 'Called', 'Answered', 'Leads', 'Status', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={c.id} className={`border-b border-white/5 hover:bg-white/[0.01] transition-colors ${i === campaigns.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{c.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{c.goal} · {c.date}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{c.contacts.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {c.called > 0 ? (
                          <div>
                            <span className="text-slate-400">{c.called.toLocaleString()}</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${c.contacts ? (c.called / c.contacts) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{c.answered > 0 ? c.answered.toLocaleString() : <span className="text-slate-600">—</span>}</td>
                      <td className="px-6 py-4">
                        {c.leads > 0
                          ? <span className="text-green-400 font-medium">{c.leads}</span>
                          : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate('results', c)}
                          className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    )
  }