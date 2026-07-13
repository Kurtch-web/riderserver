import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/auth'

const AuthContext = createContext()

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail.map(({ msg }) => msg).filter(Boolean).join(', ') || fallback
  }

  return fallback
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const getStoredAuth = () => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!storedToken || !storedUser) {
    return { token: null, user: null }
  }

  try {
    return { token: storedToken, user: JSON.parse(storedUser) }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { token: null, user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const storedAuth = getStoredAuth()
  const [user, setUser] = useState(storedAuth.user)
  const [token, setToken] = useState(storedAuth.token)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      const { access_token } = response.data
      
      // Get user info
      const userResponse = await authAPI.getMe(access_token)
      
      setToken(access_token)
      setUser(userResponse.data)
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userResponse.data))
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error, 'Login failed') 
      }
    }
  }

  const register = async (fullName, email, password) => {
    try {
      const response = await authAPI.register({ 
        full_name: fullName, 
        email, 
        password 
      })
      
      // Auto-login after registration
      const loginResult = await login(email, password)
      return loginResult
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error, 'Registration failed') 
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
