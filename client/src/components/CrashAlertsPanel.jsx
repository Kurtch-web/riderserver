import { useEffect, useState } from 'react'
import { AlertTriangle, Phone, X } from 'lucide-react'
import { crashAPI } from '../services/api'

function formatCrashTime(value) {
  if (!value) return 'Unknown time'
  return new Date(value).toLocaleString()
}

function ContactDetails({ name, phone }) {
  if (!name && !phone) return null

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <p className="font-medium text-white">{name || 'Emergency contact'}</p>
      {phone && (
        <a className="mt-2 flex items-center gap-2 text-blue-300 hover:text-blue-200" href={`tel:${phone}`}>
          <Phone className="h-4 w-4" />
          {phone}
        </a>
      )}
    </div>
  )
}

function CrashDetails({ crash, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation" onClick={onClose}>
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-red-500/40 bg-gray-800 p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="crash-details-title" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-300">
              <AlertTriangle className="h-4 w-4" /> Crash alert
            </p>
            <h2 id="crash-details-title" className="text-2xl font-bold text-white">{crash.rider_name || 'Unknown rider'}</h2>
            <p className="mt-1 text-sm text-gray-400">{formatCrashTime(crash.crash_time)}</p>
          </div>
          <button type="button" aria-label="Close crash details" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['G-force', `${Number(crash.g_force || 0).toFixed(2)} G`],
            ['Temperature', crash.temperature == null ? '--' : `${Number(crash.temperature).toFixed(1)}°`],
            ['Device', crash.device_name || '--'],
            ['Device ID', crash.device_id || '--'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-gray-900 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 break-words text-sm font-semibold text-gray-100">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-white">Acceleration</h3>
            <p className="text-sm text-gray-300">X: {Number(crash.accel_x || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-300">Y: {Number(crash.accel_y || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-300">Z: {Number(crash.accel_z || 0).toFixed(2)}</p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Gyroscope</h3>
            <p className="text-sm text-gray-300">X: {Number(crash.gyro_x || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-300">Y: {Number(crash.gyro_y || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-300">Z: {Number(crash.gyro_z || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-white">Location</h3>
          <p className="text-sm text-gray-300">Latitude: {crash.gps_latitude ?? '--'}</p>
          <p className="text-sm text-gray-300">Longitude: {crash.gps_longitude ?? '--'}</p>
          <p className="text-sm text-gray-300">Altitude: {crash.gps_altitude ?? '--'}</p>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-white">Emergency contacts</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <ContactDetails name={crash.emergency_contact1_name} phone={crash.emergency_contact1_phone} />
            <ContactDetails name={crash.emergency_contact2_name} phone={crash.emergency_contact2_phone} />
          </div>
        </div>
      </section>
    </div>
  )
}

function CrashAlertsPanel({ token }) {
  const [crashes, setCrashes] = useState([])
  const [selectedCrash, setSelectedCrash] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return undefined

    const fetchCrashes = async () => {
      try {
        const response = await crashAPI.getRecent(token)
        setCrashes(response.data)
        setError(null)
      } catch (requestError) {
        setError(requestError.response?.data?.detail || 'Failed to load crash alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchCrashes()
    const interval = setInterval(fetchCrashes, 5000)
    return () => clearInterval(interval)
  }, [token])

  if (loading) return <p className="text-gray-400">Loading crash alerts...</p>
  if (error) return <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">{error}</div>

  return (
    <>
      <section className="rounded-xl border border-gray-700 bg-gray-800">
        <div className="border-b border-gray-700 p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><AlertTriangle className="h-5 w-5 text-red-400" /> Crash alerts</h2>
          <p className="mt-1 text-sm text-gray-400">{crashes.length} recorded crash{crashes.length === 1 ? '' : 'es'}</p>
        </div>
        {crashes.length === 0 ? (
          <p className="p-5 text-gray-400">No crashes have been recorded.</p>
        ) : (
          <div className="divide-y divide-gray-700">
            {crashes.map((crash) => (
              <button key={crash.id} type="button" onClick={() => setSelectedCrash(crash)} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-gray-700/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-300"><AlertTriangle className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white">{crash.rider_name || 'Unknown rider'}</span>
                  <span className="block truncate text-sm text-gray-400">{formatCrashTime(crash.crash_time)} · {crash.device_name}</span>
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-red-500/15 px-2.5 py-1 text-xs text-red-300">Crash</span>
              </button>
            ))}
          </div>
        )}
      </section>
      {selectedCrash && <CrashDetails crash={selectedCrash} onClose={() => setSelectedCrash(null)} />}
    </>
  )
}

export default CrashAlertsPanel
