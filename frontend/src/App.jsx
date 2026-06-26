import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import CampaignPage from './pages/CampaignPage'
import ResultsPage from './pages/ResultsPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DialerPage from './pages/DialerPage'
import WorkflowPage from './pages/WorkflowPage'
import React from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:5001'

export default function App() {
  const [page, setPage] = useState('landing')
  const [campaign, setCampaign] = useState(null)
  const [authChecked, setAuthChecked] = useState(false) // ✅ pehle check karo, phir render karo

  const navigate = (to, data) => {
    if (data) setCampaign(data)
    setPage(to)
    window.scrollTo(0, 0)
  }

  // ✅ App load hote hi cookie check karo
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          withCredentials: true // cookie automatically jaayegi
        })
        if (res.data.success) {
          // Cookie valid hai — dashboard pe bhejo
          setPage('dashboard')
        }
      } catch (err) {
        // Cookie nahi hai ya expire ho gayi — landing page pe rehne do
        console.log('Not logged in, showing landing page')
      } finally {
        setAuthChecked(true) // check complete
      }
    }
    checkAuth()
  }, [])

  // ✅ Jab tak auth check nahi hua, blank screen dikho (flicker avoid)
  if (!authChecked) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#080C14', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '14px'
      }}>
        Loading...
      </div>
    )
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
      {page === 'dialer' && <DialerPage navigate={navigate} />}
      {page === 'workflow' && <WorkflowPage navigate={navigate} />}
    </>
  )
}