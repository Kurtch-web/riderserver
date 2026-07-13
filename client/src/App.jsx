import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Dashboard from './components/Dashboard'
import Navbar from './components/layout/Navbar'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const showNavbar = location.pathname === '/'

  return (
    <>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={loading ? <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div> : isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />}
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
