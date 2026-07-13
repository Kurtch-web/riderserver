import React from 'react'
import { MapPin, Satellite, Navigation } from 'lucide-react'

function GPSDisplay({ gps }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-400" />
        GPS Location
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Latitude</span>
          </div>
          <p className="text-2xl font-bold">{gps?.latitude ?? '--'}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Longitude</span>
          </div>
          <p className="text-2xl font-bold">{gps?.longitude ?? '--'}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Satellite className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400">Satellites</span>
          </div>
          <p className="text-2xl font-bold">{gps?.satellites ?? '--'}</p>
        </div>
      </div>
    </div>
  )
}

export default GPSDisplay
