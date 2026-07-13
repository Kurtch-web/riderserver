import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Activity, Navigation, Zap } from 'lucide-react'

function Hero() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/signin')
  }

  const handleLearnMore = () => {
    document.getElementById('safety-rules').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Next-Gen Safety Technology</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Helmet
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                SIVIR
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              Intelligent Helmet Safety System
            </p>

            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              Real-time sensor monitoring powered by advanced accelerometer, gyroscope, and GPS technology. 
              Protect riders with instant safety analytics and emergency response.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Admin Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLearnMore}
                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5"
              >
                Explore Features
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <Navigation className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Impact Detection</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Central Shield */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <Shield className="w-full h-full text-blue-400" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-blue-500 rounded-2xl p-4 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-purple-500 rounded-2xl p-4 shadow-lg">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-1/2 -right-8 bg-green-500 rounded-2xl p-4 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-purple-500/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
    </section>
  )
}

export default Hero
