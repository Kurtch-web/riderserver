import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Moon, Sun, LogIn } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function Navbar({ onSignIn, onSignUp }) {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/signin')
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Helmet SIVIR
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>

            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
