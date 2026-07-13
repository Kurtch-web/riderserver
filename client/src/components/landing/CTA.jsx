import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Mail, Zap } from 'lucide-react'

function CTA() {
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/signin')
  }

  const handleContact = () => {
    window.location.href = 'mailto:support@helmetsivir.com'
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Get Started Today</span>
          </div>

          <Shield className="w-20 h-20 mx-auto mb-8 text-blue-400" />
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Enhance Your Safety?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of riders who trust Helmet SIVIR for real-time safety monitoring and protection. 
            Take control of your safety with intelligent helmet technology.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25 text-lg"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleContact}
              className="border-2 border-white/30 hover:border-white/50 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 hover:bg-white/5 text-lg"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-4">Trusted by riders worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Advanced Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
