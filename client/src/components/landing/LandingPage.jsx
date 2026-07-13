import React from 'react'
import Hero from './Hero'
import SafetyRules from './SafetyRules'
import RoadSafety from './RoadSafety'
import CTA from './CTA'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero />
      <SafetyRules />
      <RoadSafety />
      <CTA />
    </div>
  )
}

export default LandingPage
