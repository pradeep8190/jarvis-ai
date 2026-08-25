import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import robotImg from '../assets/robot.png'
import './HeroPage.css'

interface HeroPageProps {
  isReady?: boolean
}

export const HeroPage: React.FC<HeroPageProps> = ({ isReady = false }) => {
  const [pulse, setPulse] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  // Direct element references for 60FPS fluid lerp motion
  const robotRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const specsRef = useRef<HTMLDivElement>(null)
  const leftSpecsRef = useRef<HTMLDivElement>(null)

  // Target and current mouse positions (-1 to 1)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  const [introActive, setIntroActive] = useState(false)

  useEffect(() => {
    if (!isReady) return

    // Trigger entrance animations exactly when preloader is done
    setIntroActive(true)
    const timer = setTimeout(() => {
      setIntroActive(false)
    }, 2200)

    return () => clearTimeout(timer)
  }, [isReady])



  useEffect(() => {
    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (introActive) return
      const { innerWidth, innerHeight } = window
      targetPos.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: (e.clientY / innerHeight) * 2 - 1
      }
    }

    const handleMouseLeave = () => {
      targetPos.current = { x: 0, y: 0 }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Smooth Lerp Animation Loop
    const animate = () => {
      if (introActive) {
        animId = requestAnimationFrame(animate)
        return
      }

      // Smooth interpolation factor
      const ease = 0.06
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease

      const { x, y } = currentPos.current

      // 1. Robot 3D Perspective Tilt
      if (robotRef.current) {
        const rotY = x * 8
        const rotX = -y * 6
        const transX = x * 15
        const transY = y * 8
        robotRef.current.style.transform = `translateX(calc(-50% + ${transX}px)) translateY(${transY}px) perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg)`
      }




      // 4. Background Title Depth Shift
      if (titleRef.current) {
        const titleX = -x * 35
        const titleY = -y * 15
        titleRef.current.style.transform = `translateX(calc(-50% + ${titleX}px)) translateY(${titleY}px)`
      }

      // 5. Specs Parallax Shift (Right side)
      if (specsRef.current) {
        const specsX = -x * 12
        const specsY = -y * 8
        specsRef.current.style.transform = `translateY(${specsY}px) translateX(${specsX}px)`
      }

      // 6. Left Specs Parallax Shift (Left side)
      if (leftSpecsRef.current) {
        const specsX = -x * 12
        const specsY = -y * 8
        leftSpecsRef.current.style.transform = `translateY(${specsY}px) translateX(${specsX}px)`
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [introActive])

  const handleClick = () => {
    setPulse(true)
    setTimeout(() => setPulse(false), 700)
  }

  return (
    <div className={`hero-page ${introActive ? 'intro-active' : ''}`} onClick={handleClick}>
      {/* Click Energy Pulse Wave */}
      {pulse && <div className="click-pulse-wave"></div>}

      {/* HUD Left & Right Running Lines */}
      <div className="hud-line left">
        <div className="hud-runner runner-1"></div>
        <div className="hud-runner runner-2"></div>
        <div className="hud-runner runner-3"></div>
        <div className="hud-ticks">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </div>
      <div className="hud-line right">
        <div className="hud-runner runner-1"></div>
        <div className="hud-runner runner-2"></div>
        <div className="hud-runner runner-3"></div>
        <div className="hud-ticks">
          <span>01</span><span>02</span><span>03</span>
        </div>
      </div>

      {/* Tech Background Grid & Random Accent Squares */}
      <div className="hero-grid-overlay">
        <div className="grid-cell-highlight cell-1"></div>
        <div className="grid-cell-highlight cell-2"></div>
        <div className="grid-cell-highlight cell-3"></div>
        <div className="grid-cell-highlight cell-4"></div>
        <div className="grid-cell-highlight cell-5"></div>
        <div className="grid-cross cross-1">+</div>
        <div className="grid-cross cross-2">+</div>
        <div className="grid-cross cross-3">+</div>
        <div className="grid-cross cross-4">+</div>
      </div>

      {/* Top Navigation */}
      <Navbar />

      {/* Hero Canvas / Interactive Stage */}
      <div className="hero-stage" ref={stageRef}>
        
        {/* Massive Background Title */}
        <h1 className="hero-big-title" ref={titleRef}>JARVIS</h1>

        {/* Cinematic Studio Spotlight Glow following cursor */}
        <div className="hero-spotlight" ref={spotlightRef}></div>

        {/* Centerpiece: Humanoid Robot with 3D Depth Tilt */}
        <div className="robot-wrapper" ref={robotRef}>
          <img 
            src={robotImg} 
            alt="Jarvis Humanoid Robot" 
            className="hero-robot-image"
            draggable={false}
          />
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">SCROLL TO BUILD</span>
          <svg className="scroll-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>

        {/* Right HUD Specifications Legend */}
        <div className="right-hud-specs" ref={specsRef}>
          <div className="spec-item">
            <span className="spec-label">MODEL</span>
            <span className="spec-value">DEEP-JARVIS-v2.2</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">TYPE</span>
            <span className="spec-value">SYSTEM ORCHESTRATOR</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">AUTH</span>
            <span className="spec-value">SHA-256 SECURED</span>
          </div>
        </div>

        {/* Left HUD Specifications / Diagnostics Legend */}
        <div className="left-hud-specs" ref={leftSpecsRef}>
          <div className="spec-item">
            <span className="spec-label">SYS.CORE</span>
            <span className="spec-value">ONLINE // ACTIVE</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">MODULES</span>
            <span className="spec-value">04 CAPABILITIES</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">NET.LINK</span>
            <span className="spec-value">SECURED // LOCAL</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeroPage
