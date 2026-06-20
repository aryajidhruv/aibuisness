import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import CampaignPage from './pages/CampaignPage'
import ResultsPage from './pages/ResultsPage'
import Login from './pages/Login' // Login page imported hai perfectly
import React from 'react'

export default function App() {
  const [page, setPage] = useState('landing')
  const [campaign, setCampaign] = useState(null)

  const navigate = (to, data) => {
    if (data) setCampaign(data)
    setPage(to)
    window.scrollTo(0, 0)
  }

  return (
    <>
      {page === 'landing'    && <LandingPage navigate={navigate} />}
      {page === 'onboarding' && <OnboardingPage navigate={navigate} />}
      {page === 'dashboard'  && <DashboardPage navigate={navigate} campaign={campaign} />}
      {page === 'campaign'   && <CampaignPage navigate={navigate} campaign={campaign} />}
      {page === 'results'    && <ResultsPage navigate={navigate} campaign={campaign} />}
      
      {/* 💥 MAGIC FIX: Jab page 'login' ho, toh Login component render hoga */}
      {page === 'login'      && <Login navigate={navigate} />}
    </>
  )
}