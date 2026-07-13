import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function AccelerometerChart({ data }) {

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Accelerometer Data</h3>
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
          <Line type="monotone" dataKey="x" stroke="#3B82F6" name="X (m/s²)" />
          <Line type="monotone" dataKey="y" stroke="#10B981" name="Y (m/s²)" />
          <Line type="monotone" dataKey="z" stroke="#F59E0B" name="Z (m/s²)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AccelerometerChart
