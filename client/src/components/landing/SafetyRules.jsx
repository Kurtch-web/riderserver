import React from 'react'
import { CheckCircle, AlertTriangle, Shield, Award, Wrench, Clock } from 'lucide-react'

function SafetyRules() {
  const helmetRules = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Always Wear Your Helmet",
      description: "A properly fitted helmet can reduce the risk of head injury by up to 85%. Never ride without one.",
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Check Helmet Condition",
      description: "Inspect your helmet regularly for cracks, loose padding, or damaged straps. Replace if compromised.",
      color: "purple"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Proper Fit is Essential",
      description: "Your helmet should sit level on your head and not move side-to-side. Straps should form a V under your ears.",
      color: "red"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Protection",
      description: "Only use helmets that meet safety standards (DOT, Snell, ECE). Certification ensures quality testing.",
      color: "green"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Replace After Impact",
      description: "Even if no damage is visible, replace your helmet after any significant impact. The foam may be compromised.",
      color: "orange"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Keep It Secure",
      description: "Always fasten the chin strap securely. An unsecured helmet offers no protection in an accident.",
      color: "indigo"
    }
  ]

  const colorMap = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-400 to-blue-600" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-600 dark:text-purple-400", gradient: "from-purple-400 to-purple-600" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-600 dark:text-red-400", gradient: "from-red-400 to-red-600" },
    green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-600 dark:text-green-400", gradient: "from-green-400 to-green-600" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-600 dark:text-orange-400", gradient: "from-orange-400 to-orange-600" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", gradient: "from-indigo-400 to-indigo-600" }
  }

  return (
    <section id="safety-rules" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Safety First</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Helmet Safety Rules
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow these essential safety guidelines to maximize your protection on the road
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helmetRules.map((rule, index) => {
            const colors = colorMap[rule.color]
            return (
              <div 
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colors.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {rule.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {rule.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SafetyRules
