import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Pricing.css'

// Helper component for keynote-style rolling integer animation
const AnimatedPrice: React.FC<{ value: number }> = ({ value }) => {
  const [displayVal, setDisplayVal] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (displayVal === value) return
    setIsAnimating(true)
    
    const steps = 12 // snappier animation
    const stepTime = 25 // 300ms total duration
    let currentStep = 0
    const startVal = displayVal
    const diff = value - startVal
    
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Ease out quadratic progress curve
      const easeProgress = progress * (2 - progress)
      const nextVal = Math.round(startVal + diff * easeProgress)
      
      setDisplayVal(nextVal)
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayVal(value)
        setIsAnimating(false)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <span className={`price-number-roll ${isAnimating ? 'number-rolling' : ''}`}>
      {displayVal}
    </span>
  )
}

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Hobby Core',
      priceMonthly: 0,
      priceYearly: 0,
      desc: 'Run completely local under sandboxed parameters.',
      features: [
        'Standard command audio triggers',
        'Direct static folder search tool',
        'Offline client console access',
        'Default telemetry configuration'
      ],
      btnText: 'Start Free Core',
      recommended: false
    },
    {
      name: 'Developer Pro',
      priceMonthly: 15,
      priceYearly: 12,
      desc: 'Complete workflow controller with low-latency sockets.',
      features: [
        'Multi-directory automatic folder scanner',
        'LiveKit Voice cloud bridge integration',
        'Full file explorer metadata editor',
        'Real-time network diagnostic charts'
      ],
      btnText: 'Deploy Pro Build',
      recommended: true
    },
    {
      name: 'Enterprise Shield',
      priceMonthly: 45,
      priceYearly: 36,
      desc: 'Autonomous workspace administration and visual guards.',
      features: [
        'Google Home bridge sync triggers',
        'Simulated GUI keystroke automation',
        'Wi-Fi router admin blacklist tool',
        'Optical presence lock screen guard'
      ],
      btnText: 'Establish Cluster',
      recommended: false
    }
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // 1. Header details sequential slide-up
    gsap.fromTo(['.pricing-header .pricing-tagline', '.pricing-header .pricing-title', '.pricing-header .pricing-subtitle', '.pricing-header .toggle-container'],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#pricing',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )

    // 2. Pricing cards staggered slide-up and fade
    gsap.fromTo('.pricing-card',
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        
        {/* Header */}
        <div className="pricing-header">
          <span className="pricing-tagline">Access Matrix</span>
          <h2 className="pricing-title">Simple, transparent deployment.</h2>
          <p className="pricing-subtitle">
            Choose the core clustering layer that matches your workspace requirements.
          </p>

          {/* Toggle Switch */}
          <div className="toggle-container">
            <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
            <button 
              className={`pricing-toggle-btn ${isYearly ? 'checked' : ''}`}
              onClick={() => setIsYearly(!isYearly)}
              aria-label="Toggle yearly billing"
            >
              <div className="toggle-knob"></div>
            </button>
            <span className={`toggle-label ${isYearly ? 'active' : ''}`}>
              Yearly <span className="discount-badge">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly
            const highlightClass = i === 0 
              ? 'pricing-hobby-highlight' 
              : i === 1 
                ? 'pricing-pro-highlight' 
                : 'pricing-enterprise-highlight'
            
            return (
              <div 
                className={`pricing-card ${highlightClass} ${plan.recommended ? 'recommended-plan' : ''}`} 
                key={i}
              >
                {/* Volumetric Corner Glow & Noise Dot */}
                <div className="card-corner-glow"></div>
                <div className="card-noise-dot"></div>

                {/* Visual Ambient Glow for Pro card */}
                {plan.recommended && <div className="pricing-card-glow"></div>}

                <div className="card-top-info">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.desc}</p>
                  
                  {/* Price */}
                  <div className="plan-price-block">
                    <span className="currency">$</span>
                    <span className="price-number">
                      <AnimatedPrice value={price} />
                    </span>
                    <span className="period">/ month</span>
                  </div>
                  {isYearly && price > 0 && (
                    <span className="yearly-billed-info">Billed annually</span>
                  )}
                </div>

                {/* Bullet list */}
                <ul className="plan-features-list">
                  {plan.features.map((feat, idx) => (
                    <li className="plan-feature-item" key={idx}>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button 
                  className={`btn-pricing-action ${plan.recommended ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.btnText}
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Pricing
