import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://riderserver.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const membersAPI = {
  getMembers: (token) => api.get('/auth/members', {
    headers: { Authorization: `Bearer ${token}` },
  }),
}

export const sensorAPI = {
  // Get all sensor data
  getSensorData: () => api.get('/sensors'),
  
  // Get accelerometer data
  getAccelerometerData: () => api.get('/sensors/accelerometer'),
  
  // Get gyroscope data
  getGyroscopeData: () => api.get('/sensors/gyroscope'),
  
  // Get GPS data
  getGPSData: () => api.get('/sensors/gps'),
  
  // Get recent sensor history
  getSensorHistory: (limit = 50) => api.get(`/sensors/history?limit=${limit}`),

  // Post sensor data from ESP32
  postSensorData: (data) => api.post('/sensors', data),
}

export const crashAPI = {
  getRecent: (token, limit = 50) => api.get(`/crashes/?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
  getById: (token, crashId) => api.get(`/crashes/${crashId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
}

export default api
