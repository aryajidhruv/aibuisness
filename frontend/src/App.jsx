import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import CampaignPage from './pages/CampaignPage'
import ResultsPage from './pages/ResultsPage'
import Login from './pages/Login' 
import Signup from './pages/Signup' // 👈 1. Naya Signup page import karo
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
      {page === 'login'      && <Login navigate={navigate} />}
      
      {/* 🚀 2. MAGIC FIX FOR SIGNUP: Jab page state 'signup' hogi, toh ye render hoga */}
      {page === 'signup'     && <Signup navigate={navigate} />}
    </>
  )
}