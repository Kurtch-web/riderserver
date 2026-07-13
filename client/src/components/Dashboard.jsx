import { useEffect, useState } from 'react'
import { AlertTriangle, LayoutDashboard, Menu, Users, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { sensorAPI } from '../services/api'
import SensorCard from './SensorCard'
import AccelerometerChart from './charts/AccelerometerChart'
import GyroChart from './charts/GyroChart'
import GPSDisplay from './GPSDisplay'
import Header from './layout/Header'
import MembersPanel from './MembersPanel'
import CrashAlertsPanel from './CrashAlertsPanel'

function Dashboard() {
  const { user, token, logout } = useAuth()
  const [sensorData, setSensorData] = useState(null)
  const [sensorHistory, setSensorHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const [response, historyResponse] = await Promise.all([
          sensorAPI.getSensorData(),
          sensorAPI.getSensorHistory(),
        ])
        setSensorData(response.data)
        setSensorHistory(historyResponse.data)
      } catch (err) {
        setError('Failed to fetch sensor data')
        console.error('Error fetching sensor data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSensorData()
    const interval = setInterval(fetchSensorData, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const selectSection = (section) => {
    setActiveSection(section)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex">
        <button
          type="button"
          aria-label="Open dashboard navigation"
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-5 left-5 z-20 rounded-full bg-blue-600 p-3 text-white shadow-lg md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close dashboard navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-700 bg-gray-800 p-4 transition-transform md:static md:block md:min-h-[calc(100vh-81px)] md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between px-3 md:hidden">
            <span className="font-semibold">Navigation</span>
            <button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Admin workspace</p>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => selectSection('overview')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${activeSection === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </button>
            {user?.is_admin && (
              <>
                <button
                  type="button"
                  onClick={() => selectSection('crashes')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${activeSection === 'crashes' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  Crash alerts
                </button>
                <button
                  type="button"
                  onClick={() => selectSection('members')}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${activeSection === 'members' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <Users className="h-5 w-5" />
                  Members
                </button>
              </>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="container mx-auto px-4 py-8">
            {activeSection === 'crashes' && user?.is_admin ? (
              <>
                <h1 className="mb-8 text-3xl font-bold">Crash alerts</h1>
                <CrashAlertsPanel token={token} />
              </>
            ) : activeSection === 'members' && user?.is_admin ? (
              <>
                <h1 className="mb-8 text-3xl font-bold">Members</h1>
                <MembersPanel token={token} />
              </>
            ) : (
              <>
                {user?.is_admin && (
                  <div className="mb-8">
                    <h1 className="mb-4 text-3xl font-bold">Priority crash alerts</h1>
                    <CrashAlertsPanel token={token} />
                  </div>
                )}
                <h1 className="mb-8 text-3xl font-bold">Sensor Dashboard</h1>
                {error && (
                  <div className="mb-6 rounded-lg border border-red-500 bg-red-500/20 p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
                      <p>Loading sensor data...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <SensorCard
                        title="Accelerometer"
                        icon="Activity"
                        status={sensorData?.status === 'success' ? 'active' : 'inactive'}
                        value={sensorData?.data?.accelerometer ? 'Active' : 'No Data'}
                      />
                      <SensorCard
                        title="Gyroscope"
                        icon="RotateCw"
                        status={sensorData?.status === 'success' ? 'active' : 'inactive'}
                        value={sensorData?.data?.gyroscope ? 'Active' : 'No Data'}
                      />
                      <SensorCard
                        title="GPS"
                        icon="MapPin"
                        status={sensorData?.data?.gps?.has_fix ? 'active' : 'searching'}
                        value={sensorData?.data?.gps?.has_fix ? 'Fixed' : 'No Fix'}
                      />
                    </div>
                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <AccelerometerChart data={sensorHistory.map(({ timestamp, accelerometer }) => ({ time: timestamp, ...accelerometer }))} />
                      <GyroChart data={sensorHistory.map(({ timestamp, gyroscope }) => ({ time: timestamp, ...gyroscope }))} />
                    </div>
                    <GPSDisplay gps={sensorData?.data?.gps} />
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
