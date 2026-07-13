import React from 'react'
import { Lightbulb, Eye, Zap, Phone, MapPin, ShieldCheck } from 'lucide-react'

function RoadSafety() {
  const roadTips = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Obey Traffic Signals",
      description: "Always stop at red lights and stop signs. Follow traffic rules to prevent accidents.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Stay Alert",
      description: "Keep your eyes on the road. Avoid distractions like phones or headphones while riding.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Use Lights at Night",
      description: "Ensure your bike has working front and rear lights. Wear reflective clothing for visibility.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Emergency Preparedness",
      description: "Carry emergency contact information and know basic first aid. Keep your phone charged.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Plan Your Route",
      description: "Choose safer routes with less traffic. Avoid high-speed roads and use bike lanes when available.",
      gradient: "from-red-400 to-red-600"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Regular Maintenance",
      description: "Keep your bike in good condition. Check brakes, tires, and chain regularly for safe riding.",
      gradient: "from-indigo-400 to-indigo-600"
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Road Safety</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Road Safety Guidelines
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Essential tips for staying safe on the road
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadTips.map((tip, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tip.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
              
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${tip.gradient} mb-6`}>
                <div className="text-white">
                  {tip.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {tip.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoadSafety
