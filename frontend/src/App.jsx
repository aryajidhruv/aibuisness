import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import CampaignPage from './pages/CampaignPage'
import ResultsPage from './pages/ResultsPage'
import Login from './pages/Login'
import Signup from './pages/Signup'

// 🌟 DIALER PAGE AUR WORKFLOW PAGE DONO IMPORT KAR LIYE HAIN BHAI
import DialerPage from './pages/DialerPage' 
import WorkflowPage from './pages/WorkflowPage' 

import React from 'react'

export default function App() {
  // 💡 TIP: Agar screen test karni ho toh 'landing' ko badal kar 'workflow' ya 'dialer' kar dena temporary!
  const [page, setPage] = useState('landing')
  const [campaign, setCampaign] = useState(null)

  const navigate = (to, data) => {
    if (data) setCampaign(data)
    setPage(to)
    window.scrollTo(0, 0)
  }

  return (
    <>
      {page === 'landing' && <LandingPage navigate={navigate} />}
      {page === 'onboarding' && <OnboardingPage navigate={navigate} />}
      {page === 'dashboard' && (
        <DashboardPage navigate={navigate} campaign={campaign} />
      )}
      {page === 'campaign' && (
        <CampaignPage navigate={navigate} campaign={campaign} />
      )}
      {page === 'results' && (
        <ResultsPage navigate={navigate} campaign={campaign} />
      )}
      {page === 'login' && <Login navigate={navigate} />}
      {page === 'signup' && <Signup navigate={navigate} />}

      {/* =========================================================
          🌟 Twilio Voice Dialer Page System
          Jab state 'dialer' hogi, toh humara ye component load hoga.
      ========================================================= */}
      {page === 'dialer' && <DialerPage navigate={navigate} />}

      {/* =========================================================
          🌟 Workflow Builder Page Section
          Jab page state "workflow" hogi tab Workflow Builder open hoga.
      ========================================================= */}
      {page === 'workflow' && <WorkflowPage navigate={navigate} />}
     
    </>
  )
}