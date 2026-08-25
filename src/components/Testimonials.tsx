import React, { useEffect, useRef } from 'react'
import './Testimonials.css'

interface TestimonialItem {
  quote: string
  author: string
  role: string
}

export const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const testimonials: TestimonialItem[] = [
    {
      quote: "Jarvis completely redefined my local coding workspace. Spawning sub-agents to debug active router ports while I voice-chat with the core feels like science fiction.",
      author: "Devon R.",
      role: "Principal Kernel Architect"
    },
    {
      quote: "The laptop control fallback is insane. I watched it drive my desktop mouse and type inside a legacy app without any API hooks. True autonomy.",
      author: "Sarah K.",
      role: "Staff Automation Engineer"
    },
    {
      quote: "Zero cloud latency is the truth. Voice responses are under a second, and knowing my source code never leaves my local SSD is a massive security relief.",
      author: "Marcus V.",
      role: "Senior Security Researcher"
    },
    {
      quote: "I hooked Jarvis into my Google Home setup and local shell scripts. Now I can manage server backups and room climate in a single vocal thread.",
      author: "Elena S.",
      role: "Infrastructure Lead"
    },
    {
      quote: "It is like having a pair programmer who can actually touch my machine. The shell script validation alone saves me hours of manual execution.",
      author: "Justin T.",
      role: "Tech Lead"
    }
  ]

  // Triple the array for seamless infinite scroll
  const doubleTestimonials = [...testimonials, ...testimonials, ...testimonials]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    const track = trackRef.current
    if (!scrollContainer || !track) return

    let animId: number
    let scrollX = 0
    const speed = 0.8

    const animate = () => {
      scrollX += speed
      
      const firstSetWidth = (track.scrollWidth / 3)
      if (scrollX >= firstSetWidth) {
        scrollX = 0
      }

      // Shift track
      track.style.transform = `translateX(${-scrollX}px)`

      // Calculate curves for each card relative to screen center
      const cards = track.querySelectorAll('.testimonial-card')
      const screenCenterX = window.innerWidth / 2
      const maxDist = window.innerWidth / 2

      cards.forEach((card) => {
        const htmlCard = card as HTMLElement
        const rect = htmlCard.getBoundingClientRect()
        const cardCenterX = rect.left + rect.width / 2

        const distance = cardCenterX - screenCenterX
        const ratio = distance / maxDist
        const clampedRatio = Math.max(-1.2, Math.min(1.2, ratio))
        const absRatio = Math.abs(clampedRatio)

        // Curved vertical deflection
        const yOffset = absRatio * absRatio * 65
        
        // Tilt rotation
        const rotation = clampedRatio * 8 

        // Scale factor
        const scale = 1.05 - absRatio * 0.17

        // Fade factor
        const opacity = 1.0 - Math.min(0.75, absRatio * 0.65)

        htmlCard.style.transform = `translate3d(0, ${yOffset}px, 0) rotateZ(${rotation}deg) scale(${scale})`
        htmlCard.style.opacity = `${opacity}`
      })

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="testimonial-section" ref={scrollRef}>
      <div className="testimonial-wrapper">
        {/* Left Column Header */}
        <div className="testimonial-intro-col">
          <span className="testimonial-tagline">User Metrics</span>
          <h2 className="testimonial-title">Decentralized Feedback.</h2>
          <p className="testimonial-subtitle">
            What developers and security systems administrators say after deploying the Jarvis local core into their production systems.
          </p>
        </div>

        {/* Auto-play Viewport Container */}
        <div className="testimonial-scroll-viewport">
          <div className="testimonial-scroll-track" ref={trackRef}>
            {doubleTestimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-card-inner">
                  {/* Volumetric Corner Glow & Noise Dot */}
                  <div className="card-corner-glow"></div>
                  <div className="card-noise-dot"></div>

                  <span className="testimonial-index">USER // 0{(i % testimonials.length) + 1}</span>
                  <p className="testimonial-quote">"{t.quote}"</p>
                  
                  <div className="testimonial-author-block">
                    <span className="testimonial-author">{t.author}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
