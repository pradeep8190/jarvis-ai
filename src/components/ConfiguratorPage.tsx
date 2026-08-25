import React, { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ConfiguratorPage.css'

interface FeatureModule {
  id: string
  name: string
  category: string
  tag: string
  desc: string
  selected: boolean
}

export const ConfiguratorPage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const leftArcRef = useRef<HTMLDivElement>(null)
  const rightArcRef = useRef<HTMLDivElement>(null)
  const coreDropZoneRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start with pills positioned at the bottom so they scroll up on entry
  const [leftTargetScrollY, setLeftTargetScrollY] = useState(0)
  const [leftCurrentScrollY, setLeftCurrentScrollY] = useState(0)
  const [isDraggingLeftArc, setIsDraggingLeftArc] = useState(false)
  const [leftDragStartY, setLeftDragStartY] = useState(0)
  const [leftDragStartScroll, setLeftDragStartScroll] = useState(0)

  // Start with pills positioned at the bottom so they scroll up on entry
  const [rightTargetScrollY, setRightTargetScrollY] = useState(0)
  const [rightCurrentScrollY, setRightCurrentScrollY] = useState(0)
  const [isDraggingRightArc, setIsDraggingRightArc] = useState(false)
  const [rightDragStartY, setRightDragStartY] = useState(0)
  const [rightDragStartScroll, setRightDragStartScroll] = useState(0)

  // Pill Drag & Drop State
  const [draggedPillId, setDraggedPillId] = useState<string | null>(null)
  const [dragMousePos, setDragMousePos] = useState<{ x: number; y: number } | null>(null)
  const [isOverCore, setIsOverCore] = useState(false)
  const [gravitationalPull, setGravitationalPull] = useState<{ dist: number; angleRad: number; intensity: number }>({
    dist: 999,
    angleRad: 0,
    intensity: 0
  })

  // 3D Gimbal Tilt
  const [gimbalTilt, setGimbalTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  // Left Flank Features (Core AI & System Intelligence)
  const [leftFeatures, setLeftFeatures] = useState<FeatureModule[]>([
    { id: 'neural-core', name: 'Neural Latent Reasoning', category: 'CORE AI', tag: 'LLM v4.2', desc: 'Multimodal latent reasoning & autonomous self-correction', selected: true },
    { id: 'context-window', name: '2M+ Context Memory', category: 'MEMORY', tag: '2048k Tokens', desc: 'Hierarchical long-term context retention matrix', selected: true },
    { id: 'voice-tts', name: 'Sub-15ms Voice Synthesis', category: 'VOICE', tag: 'Neural Audio', desc: 'Ultra-low latency expressive vocal synthesis', selected: true },
    { id: 'security-enclave', name: 'Zero-Trust Hardware Enclave', category: 'SECURITY', tag: 'AES-256 GCM', desc: 'Isolated hardware memory encryption barrier', selected: false },
    { id: 'kernel-priority', name: 'Kernel Priority Scheduler', category: 'SYSTEM', tag: 'Bare Metal', desc: 'Real-time low-latency process prioritization daemon', selected: false },
    { id: 'gesture-vision', name: 'Spatial Micro-Pinch Tracking', category: 'GESTURE', tag: '3D Depth', desc: 'Zero-touch camera tracking & spatial triggers', selected: false },
    { id: '3d-vision', name: '3D Vision Depth Daemon', category: 'GESTURE', tag: 'Spatial AI', desc: 'Continuous environmental 3D visual reconstruction', selected: false },
    { id: 'vector-store', name: 'Edge Vector Embeddings Vault', category: 'STORAGE', tag: 'HNSW Index', desc: 'High-density local vector database with semantic search', selected: false },
    { id: 'self-correction', name: 'Autonomous Self-Correction', category: 'CORE AI', tag: 'Feedback Loop', desc: 'Real-time task monitoring and error recovery loop', selected: false },
    { id: 'cpu-shield', name: 'CPU & Memory Throttling Shield', category: 'SYSTEM', tag: 'Governor', desc: 'Dynamic resource shielding against process spikes', selected: false },
    { id: 'zero-latency', name: 'Zero-Cloud Latency Execution', category: 'SYSTEM', tag: 'Edge C', desc: 'Fully offline local fallback intelligence runtime', selected: false }
  ])

  // Right Flank Features (Ecosystem, Cloud & Protocols)
  const [rightFeatures, setRightFeatures] = useState<FeatureModule[]>([
    { id: 'github-pipeline', name: 'GitHub PR & Issue Pipeline', category: 'ECOSYSTEM', tag: 'Webhook / REST', desc: 'Autonomous issue triaging and branch deployment', selected: true },
    { id: 'notion-sync', name: 'Notion Workspace Auto-Sync', category: 'KNOWLEDGE', tag: 'Bi-Directional', desc: 'Live document embeddings and auto-categorization', selected: false },
    { id: 'google-workspace', name: 'Google Workspace Cloud Relay', category: 'CLOUD', tag: 'OAuth2 RPC', desc: 'Automated Drive, Mail, and Calendar pipelines', selected: false },
    { id: 'slack-discord', name: 'Slack & Discord Event Hooks', category: 'ECOSYSTEM', tag: 'Bot Gateway', desc: 'Autonomous messaging and team collaboration daemon', selected: false },
    { id: 'smart-home', name: 'Matter & Zigbee IoT Bridge', category: 'AUTOMATION', tag: 'Thread / LAN', desc: 'Local-first zero-cloud smart home device daemon', selected: false },
    { id: 'ambient-presets', name: 'Ambient Contextual Presets', category: 'AUTOMATION', tag: 'Rule Engine', desc: 'Dynamic room lighting, HVAC, and audio scenes', selected: false },
    { id: 'local-sensor', name: 'Local Sensor Event Daemon', category: 'AUTOMATION', tag: 'Micro-Polling', desc: 'Zero-cloud latency local telemetry execution', selected: false },
    { id: 'device-handoff', name: 'Multi-Device State Relay', category: 'SYNC', tag: 'P2P Mesh', desc: 'Instant state handoff across mobile, tablet, and desktop', selected: false },
    { id: 'delta-continuity', name: 'Background Delta Continuity', category: 'SYNC', tag: 'Zero-Sync Loss', desc: 'Encrypted background data differential sync', selected: false },
    { id: 'native-hotkeys', name: 'Native System Hotkeys & Macros', category: 'OS CONTROL', tag: 'Direct Input', desc: 'Low-level global hotkey orchestration daemon', selected: false },
    { id: 'display-matrix', name: 'Display Matrix & Audio Router', category: 'OS CONTROL', tag: 'Matrix Hub', desc: 'Virtual audio routing and multi-monitor manager', selected: false },
    { id: 'biometric-calib', name: 'Continuous Motion Calibration', category: 'GESTURE', tag: 'Kalman Filter', desc: 'Adaptive smoothing filter for millimeter tracking', selected: false }
  ])

  const allFeatures = [...leftFeatures, ...rightFeatures]

  // Smooth Momentum Physics Loop for Both Arcs
  useEffect(() => {
    const loop = () => {
      setLeftCurrentScrollY((prev) => {
        const diff = leftTargetScrollY - prev
        if (Math.abs(diff) < 0.05) return leftTargetScrollY
        return prev + diff * 0.12
      })
      setRightCurrentScrollY((prev) => {
        const diff = rightTargetScrollY - prev
        if (Math.abs(diff) < 0.05) return rightTargetScrollY
        return prev + diff * 0.12
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [leftTargetScrollY, rightTargetScrollY])

  // Non-passive Wheel listener on Left Arc
  useEffect(() => {
    const el = leftArcRef.current
    if (!el) return

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setLeftTargetScrollY((prev) => {
        const next = prev + e.deltaY * 0.65
        const maxScroll = (leftFeatures.length - 1) * 72
        return Math.max(0, Math.min(maxScroll, next))
      })
    }

    el.addEventListener('wheel', handleWheelNative, { passive: false })
    return () => el.removeEventListener('wheel', handleWheelNative)
  }, [leftFeatures.length])

  // Non-passive Wheel listener on Right Arc
  useEffect(() => {
    const el = rightArcRef.current
    if (!el) return

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setRightTargetScrollY((prev) => {
        const next = prev + e.deltaY * 0.65
        const maxScroll = (rightFeatures.length - 1) * 72
        return Math.max(0, Math.min(maxScroll, next))
      })
    }

    el.addEventListener('wheel', handleWheelNative, { passive: false })
    return () => el.removeEventListener('wheel', handleWheelNative)
  }, [rightFeatures.length])

  // Mouse Dragging on Left Arc Track
  const handleLeftArcMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.arc-capsule-item')) return
    setIsDraggingLeftArc(true)
    setLeftDragStartY(e.clientY)
    setLeftDragStartScroll(leftTargetScrollY)
  }

  // Mouse Dragging on Right Arc Track
  const handleRightArcMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.arc-capsule-item')) return
    setIsDraggingRightArc(true)
    setRightDragStartY(e.clientY)
    setRightDragStartScroll(rightTargetScrollY)
  }

  // Pill Drag & Drop Start
  const handlePillDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDraggedPillId(id)
    setDragMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingLeftArc) {
        const deltaY = e.clientY - leftDragStartY
        setLeftTargetScrollY(() => {
          const next = leftDragStartScroll - deltaY * 1.1
          const maxScroll = (leftFeatures.length - 1) * 72
          return Math.max(0, Math.min(maxScroll, next))
        })
      }

      if (isDraggingRightArc) {
        const deltaY = e.clientY - rightDragStartY
        setRightTargetScrollY(() => {
          const next = rightDragStartScroll - deltaY * 1.1
          const maxScroll = (rightFeatures.length - 1) * 72
          return Math.max(0, Math.min(maxScroll, next))
        })
      }

      if (draggedPillId) {
        setDragMousePos({ x: e.clientX, y: e.clientY })

        // Black hole gravitational attraction towards center core
        if (coreDropZoneRef.current) {
          const rect = coreDropZoneRef.current.getBoundingClientRect()
          const coreCenterX = rect.left + rect.width / 2
          const coreCenterY = rect.top + rect.height / 2

          const dx = coreCenterX - e.clientX
          const dy = coreCenterY - e.clientY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const angleRad = Math.atan2(dy, dx)
          
          const maxSuctionDist = 340
          const intensity = Math.max(0, Math.min(1, 1 - dist / maxSuctionDist))

          setGravitationalPull({ dist, angleRad, intensity })
          setIsOverCore(dist < 190)
        }
      }

      // Dynamic 3D Gimbal Tilt based on mouse position
      if (coreDropZoneRef.current) {
        const rect = coreDropZoneRef.current.getBoundingClientRect()
        const coreCenterX = rect.left + rect.width / 2
        const coreCenterY = rect.top + rect.height / 2
        const deltaX = (e.clientX - coreCenterX) / (window.innerWidth / 2)
        const deltaY = (e.clientY - coreCenterY) / (window.innerHeight / 2)
        setGimbalTilt({
          x: Math.max(-14, Math.min(14, deltaY * 16)),
          y: Math.max(-18, Math.min(18, -deltaX * 18))
        })
      }
    },
    [isDraggingLeftArc, leftDragStartY, leftDragStartScroll, isDraggingRightArc, rightDragStartY, rightDragStartScroll, draggedPillId, leftFeatures.length, rightFeatures.length]
  )

  const handleGlobalMouseUp = useCallback(() => {
    setIsDraggingLeftArc(false)
    setIsDraggingRightArc(false)

    if (draggedPillId) {
      if (isOverCore) {
        setLeftFeatures((prev) =>
          prev.map((f) => (f.id === draggedPillId ? { ...f, selected: true } : f))
        )
        setRightFeatures((prev) =>
          prev.map((f) => (f.id === draggedPillId ? { ...f, selected: true } : f))
        )
      }
      setDraggedPillId(null)
      setDragMousePos(null)
      setIsOverCore(false)
      setGravitationalPull({ dist: 999, angleRad: 0, intensity: 0 })
    }
  }, [draggedPillId, isOverCore])

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  // Living Quantum Fluid Canvas in the Center Nucleus
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let angle = 0

    const particleCount = 64
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      orbitR: 42 + (i % 8) * 12,
      speed: 0.005 + (i % 6) * 0.003,
      phase: (i * Math.PI * 2) / particleCount,
      size: 0.8 + (i % 4) * 0.4,
      opacity: 0.15 + (i % 5) * 0.15,
      trail: 0.2 + (i % 3) * 0.2
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      angle += 0.012

      ctx.save()
      ctx.translate(cx, cy)

      // 1. Soft Volumetric Ambient Halo
      const haloR = 75 + Math.sin(angle * 1.2) * 4
      const haloGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, haloR)
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)')
      haloGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.015)')
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(0, 0, haloR, 0, Math.PI * 2)
      ctx.fill()

      // 2. Rotating Harmonic Starlight Particles
      particles.forEach((p) => {
        const curAngle = angle * p.speed * 90 + p.phase
        const x = Math.cos(curAngle) * p.orbitR
        const y = Math.sin(curAngle) * (p.orbitR * 0.52)

        const pGrad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2.5)
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`)
        pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Ultra-Fine Photon Corona Ring
      const coronaR = 36 + Math.sin(angle * 2) * 1.5
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, coronaR, 0, Math.PI * 2)
      ctx.stroke()

      // 4. Polished Obsidian Black Core with Specular Light Reflection
      const coreR = 32
      const coreGrad = ctx.createRadialGradient(-coreR * 0.35, -coreR * 0.35, 1, 0, 0, coreR)
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
      coreGrad.addColorStop(0.12, 'rgba(180, 180, 200, 0.4)')
      coreGrad.addColorStop(0.35, 'rgba(24, 24, 30, 0.95)')
      coreGrad.addColorStop(0.85, 'rgba(8, 8, 12, 0.98)')
      coreGrad.addColorStop(1, 'rgba(4, 4, 6, 1)')

      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(0, 0, coreR, 0, Math.PI * 2)
      ctx.fill()

      // 5. Rim Optical Highlight
      const rimGrad = ctx.createLinearGradient(-coreR, -coreR, coreR, coreR)
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
      rimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)')
      rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)')

      ctx.strokeStyle = rimGrad
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, coreR, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [])

  // GSAP ScrollTrigger Entrance Animation: Pills scroll up from bottom into center focal point
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    gsap.registerPlugin(ScrollTrigger)

    const targetLeftCenter = Math.floor(leftFeatures.length / 2) * 72 // ~360px center focal point
    const targetRightCenter = Math.floor(rightFeatures.length / 2) * 72

    const scrollAnimObj = {
      left: 0,
      right: 0
    }

    const header = section.querySelector('.config-header')
    const astrolabe = section.querySelector('.celestial-astrolabe-vessel')
    const leftRail = section.querySelector('.arc-left')
    const rightRail = section.querySelector('.arc-right')
    const footer = section.querySelector('.config-footer-bar')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })

    tl.fromTo(header,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
    )
    .fromTo(astrolabe,
      { opacity: 0, scale: 0.78, rotateX: 20 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 1.4, ease: 'power3.out' },
      '-=0.7'
    )
    .fromTo([leftRail, rightRail],
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=1.0'
    )
    // Scroll the pills up from the bottom into the center focal point
    .to(scrollAnimObj, {
      left: targetLeftCenter,
      right: targetRightCenter,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        setLeftTargetScrollY(scrollAnimObj.left)
        setRightTargetScrollY(scrollAnimObj.right)
      }
    }, '-=0.8')
    .fromTo(footer,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section) t.kill()
      })
    }
  }, [leftFeatures.length, rightFeatures.length])

  const toggleFeature = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setLeftFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    )
    setRightFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    )
  }

  const equippedModules = allFeatures.filter((f) => f.selected)

  return (
    <section className="configurator-section" id="orchestrator" ref={sectionRef}>
      {/* Header */}
      <div className="config-header">
        <div className="config-badge">
          <span className="config-badge-dot" />
          <span className="config-badge-text">NEURAL ARCHITECTURE NEXUS</span>
        </div>
        <h2 className="config-title">Customize your Jarvis</h2>
        <p className="config-subtitle">
          Drag capabilities from either flank into the central Astrolabe core to orchestrate your intelligence.
        </p>
      </div>

      {/* Symmetrical Holographic Command Deck */}
      <div className="symmetrical-holographic-deck">
        {/* Left Curved Holographic Arc `(` */}
        <div
          className={`curved-arc-viewport arc-left ${isDraggingLeftArc ? 'is-dragging' : ''}`}
          ref={leftArcRef}
          onMouseDown={handleLeftArcMouseDown}
        >
          {/* Hairline Guide Arc Path `(` */}
          <svg className="arc-rail-svg" viewBox="0 0 320 700" fill="none">
            <defs>
              <linearGradient id="arcRailGradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 24 40 C 80 220, 80 480, 24 660" stroke="url(#arcRailGradLeft)" strokeWidth="1" />
          </svg>

          {/* Left Arc Items */}
          <div className="curved-items-track">
            {leftFeatures.map((feat, index) => {
              const itemCenterY = index * 72
              const dY = itemCenterY - leftCurrentScrollY
              const halfSpan = 290
              const t = Math.max(-1.3, Math.min(1.3, dY / halfSpan))
              const centerWeight = Math.max(0, Math.cos((t * Math.PI) / 2.3))

              const curveX = 16 + 55 * centerWeight
              const topY = 350 + dY
              const transZ = (centerWeight - 0.5) * 60
              const rotZ = -t * 6
              const rotY = -10 + centerWeight * 12
              const scale = 0.76 + 0.32 * centerWeight
              const opacity = Math.max(0, 0.2 + 0.8 * centerWeight)

              if (Math.abs(t) > 1.25) return null
              const isFocused = Math.abs(t) < 0.14
              const zIndex = Math.round(centerWeight * 100)

              return (
                <div
                  key={feat.id}
                  className={`arc-capsule-item ${isFocused ? 'is-focused' : ''} ${feat.selected ? 'is-slotted' : ''}`}
                  style={{
                    left: `${curveX.toFixed(1)}px`,
                    top: `${topY.toFixed(1)}px`,
                    transform: `perspective(750px) translate3d(0, -50%, ${transZ.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                    transformOrigin: 'left center',
                    opacity: opacity.toFixed(2),
                    zIndex
                  }}
                  onClick={() => toggleFeature(feat.id)}
                  onMouseDown={(e) => handlePillDragStart(feat.id, e)}
                  title="Click to toggle or Drag into Core"
                >
                  <span className="capsule-title">{feat.name}</span>
                </div>
              )
            })}
          </div>

          <div className="arc-scroll-hint">
            <span className="scroll-hint-text">CORE SYSTEMS</span>
            <div className="scroll-hint-bar">
              <div
                className="scroll-hint-thumb"
                style={{
                  top: `${Math.min(100, Math.max(0, (leftCurrentScrollY / ((leftFeatures.length - 1) * 72)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Center Celestial Astrolabe Core Vessel */}
        <div className="astrolabe-center-workspace">
          <div
            className={`celestial-astrolabe-vessel ${isOverCore ? 'is-drop-active' : ''}`}
            ref={coreDropZoneRef}
            style={{
              transform: `perspective(1200px) rotateX(${gimbalTilt.x.toFixed(1)}deg) rotateY(${gimbalTilt.y.toFixed(1)}deg)`
            }}
          >
            {/* Multi-Axial 3D Astrolabe Rings */}
            <div className="astrolabe-ring ring-outer">
              <span className="ring-tick-mark tick-0">000°</span>
              <span className="ring-tick-mark tick-90">090°</span>
              <span className="ring-tick-mark tick-180">180°</span>
              <span className="ring-tick-mark tick-270">270°</span>
            </div>

            <div className="astrolabe-ring ring-middle" />
            <div className="astrolabe-ring ring-inner" />

            {/* Orbiting Slotted Modules Track */}
            <div className="orbiting-slotted-track">
              {equippedModules.map((mod, idx) => {
                const angle = (idx * 360) / Math.max(1, equippedModules.length)
                return (
                  <div
                    key={mod.id}
                    className="orbiting-module-badge"
                    style={{
                      transform: `rotate(${angle}deg) translate(195px) rotate(-${angle}deg)`
                    }}
                    title={`${mod.name} (Click to eject)`}
                    onClick={() => toggleFeature(mod.id)}
                  >
                    <span className="badge-orbit-dot" />
                    <span className="badge-orbit-label">{mod.name.split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>

            {/* Central Quantum Fluid Canvas */}
            <div className="quantum-core-hub">
              <canvas ref={canvasRef} width={320} height={320} className="quantum-fluid-canvas" />
            </div>
          </div>
        </div>

        {/* Right Curved Holographic Arc `)` */}
        <div
          className={`curved-arc-viewport arc-right ${isDraggingRightArc ? 'is-dragging' : ''}`}
          ref={rightArcRef}
          onMouseDown={handleRightArcMouseDown}
        >
          {/* Hairline Guide Arc Path `)` */}
          <svg className="arc-rail-svg" viewBox="0 0 320 700" fill="none">
            <defs>
              <linearGradient id="arcRailGradRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 296 40 C 240 220, 240 480, 296 660" stroke="url(#arcRailGradRight)" strokeWidth="1" />
          </svg>

          {/* Right Arc Items */}
          <div className="curved-items-track">
            {rightFeatures.map((feat, index) => {
              const itemCenterY = index * 72
              const dY = itemCenterY - rightCurrentScrollY
              const halfSpan = 290
              const t = Math.max(-1.3, Math.min(1.3, dY / halfSpan))
              const centerWeight = Math.max(0, Math.cos((t * Math.PI) / 2.3))

              const curveX = 16 + 55 * centerWeight
              const topY = 350 + dY
              const transZ = (centerWeight - 0.5) * 60
              const rotZ = t * 6
              const rotY = 10 - centerWeight * 12
              const scale = 0.76 + 0.32 * centerWeight
              const opacity = Math.max(0, 0.2 + 0.8 * centerWeight)

              if (Math.abs(t) > 1.25) return null
              const isFocused = Math.abs(t) < 0.14
              const zIndex = Math.round(centerWeight * 100)

              return (
                <div
                  key={feat.id}
                  className={`arc-capsule-item ${isFocused ? 'is-focused' : ''} ${feat.selected ? 'is-slotted' : ''}`}
                  style={{
                    right: `${curveX.toFixed(1)}px`,
                    top: `${topY.toFixed(1)}px`,
                    transform: `perspective(750px) translate3d(0, -50%, ${transZ.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                    transformOrigin: 'right center',
                    opacity: opacity.toFixed(2),
                    zIndex
                  }}
                  onClick={() => toggleFeature(feat.id)}
                  onMouseDown={(e) => handlePillDragStart(feat.id, e)}
                  title="Click to toggle or Drag into Core"
                >
                  <span className="capsule-title">{feat.name}</span>
                </div>
              )
            })}
          </div>

          <div className="arc-scroll-hint arc-scroll-hint-right">
            <span className="scroll-hint-text">ECOSYSTEM</span>
            <div className="scroll-hint-bar">
              <div
                className="scroll-hint-thumb"
                style={{
                  top: `${Math.min(100, Math.max(0, (rightCurrentScrollY / ((rightFeatures.length - 1) * 72)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ghost Pill with Black Hole Gravitational Suction Physics */}
      {draggedPillId && dragMousePos && (
        <>
          {/* Gravitational Lensing Vector Beam connecting Pill to Core Singularity */}
          {gravitationalPull.intensity > 0.05 && coreDropZoneRef.current && (() => {
            const rect = coreDropZoneRef.current.getBoundingClientRect()
            const coreCenterX = rect.left + rect.width / 2
            const coreCenterY = rect.top + rect.height / 2
            return (
              <svg className="blackhole-tether-svg">
                <defs>
                  <linearGradient id="suctionBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8 * gravitationalPull.intensity} />
                    <stop offset="70%" stopColor="#ffffff" stopOpacity={0.3 * gravitationalPull.intensity} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <line
                  x1={dragMousePos.x}
                  y1={dragMousePos.y}
                  x2={coreCenterX}
                  y2={coreCenterY}
                  stroke="url(#suctionBeamGrad)"
                  strokeWidth={1 + gravitationalPull.intensity * 2}
                  strokeDasharray="4 4"
                  className="suction-laser-line"
                />
              </svg>
            )
          })()}

          {/* Gravitational Spaghettification Ghost Pill */}
          {(() => {
            const angleDeg = (gravitationalPull.angleRad * 180) / Math.PI
            const intensity = gravitationalPull.intensity
            const scaleX = 1 + intensity * 0.35
            const scaleY = Math.max(0.65, 1 - intensity * 0.3)
            const draggedName = allFeatures.find((f) => f.id === draggedPillId)?.name
            
            return (
              <div
                className={`dragging-ghost-pill ${isOverCore ? 'ghost-over-target' : ''} ${intensity > 0.3 ? 'has-gravitational-pull' : ''}`}
                style={{
                  left: `${dragMousePos.x}px`,
                  top: `${dragMousePos.y}px`,
                  transform: `translate(-50%, -50%) rotate(${angleDeg}deg) scale(${scaleX}, ${scaleY}) rotate(-${angleDeg}deg)`
                }}
              >
                <div className="ghost-pill-body">
                  <span className="ghost-title">{draggedName}</span>
                  <span className="ghost-hint">
                    {isOverCore ? 'RELEASE TO ENGAGE' : intensity > 0.3 ? 'GRAVITATIONAL PULL ACTIVE' : 'DRAG TO CORE'}
                  </span>
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* Bottom Status Bar */}
      <div className="config-footer-bar">
        <span className="footer-status-chip">
          <span className="chip-dot" />
          {equippedModules.length} OF {allFeatures.length} MODULES SYNCHRONIZED
        </span>
      </div>
    </section>
  )
}

export default ConfiguratorPage



