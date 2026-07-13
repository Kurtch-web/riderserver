import React from 'react'
import { Activity, RotateCw, MapPin } from 'lucide-react'

const iconMap = {
  Activity: Activity,
  RotateCw: RotateCw,
  MapPin: MapPin,
}

function SensorCard({ title, icon, status, value }) {
  const Icon = iconMap[icon] || Activity
  
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-red-500',
    searching: 'bg-yellow-500',
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
      </div>
      <p className="text-2xl font-bold text-blue-400">{value}</p>
    </div>
  )
}

export default SensorCard
