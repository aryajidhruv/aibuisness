import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Google ki library se Provider ko import kiya
import { GoogleOAuthProvider } from '@react-oauth/google'
import { env } from './config/env.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
)