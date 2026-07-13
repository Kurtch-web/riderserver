import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function GyroChart({ data }) {

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Gyroscope Data</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="x" stroke="#EF4444" name="X (rad/s)" />
          <Line type="monotone" dataKey="y" stroke="#8B5CF6" name="Y (rad/s)" />
          <Line type="monotone" dataKey="z" stroke="#EC4899" name="Z (rad/s)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GyroChart
