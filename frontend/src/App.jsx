import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

import Header from './components/Header'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Portfolio from './pages/Portfolio.jsx'

import Dashboard from './pages/Dashboard.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import JobMatching from './pages/JobMatching.jsx'
import Skills from './pages/Skills.jsx'
import CareerVisualizer from './pages/CareerVisualizer.jsx'
import AIChat from './pages/AIChat.jsx'
import CodingAssessment from './pages/CodingAssessment.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'

// ProtectedRoute is kept for future use when we need to reintroduce protected routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (user == null) {
    return <Navigate to='/login' replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        const location = useLocation();

        <div className={`min-h-screen ${location.pathname === '/' || location.pathname === '/landing' ? 'bg-gray-950' : 'bg-gray-50'}`}>
          {location.pathname !== '/' && location.pathname !== '/landing' && <Header />}

          <Routes>
            {/* Public routes */}
            <Route path='/' element={<Landing />} />
            <Route path='/landing' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/portfolio' element={<Portfolio />} />

            {/* Main App Home - Public with conditional personalization */}
            <Route path='/home' element={<Dashboard />} />

            {/* Feature routes - Public (no authentication required) */}
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/resume-builder' element={<ResumeBuilder />} />
            <Route path='/job-matching' element={<JobMatching />} />
            <Route path='/skills' element={<Skills />} />
            <Route path='/career-visualizer' element={<CareerVisualizer />} />
            <Route path='/ai-chat' element={<AIChat />} />
            <Route path='/coding-assessment' element={<CodingAssessment />} />

            {/* Protected routes - Still require authentication */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/settings'
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes to home */}
            <Route path='*' element={<Navigate to='/home' replace />} />
          </Routes>

          <Toaster position='top-right' />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
