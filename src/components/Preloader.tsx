import { useEffect, useState, useRef } from 'react'
import './Preloader.css'

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string>('INITIALIZING')
  const [isDismissed, setIsDismissed] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    // Disable window scrolling during loading
    document.body.style.overflow = 'hidden'

    let current = 0
    const updateProgress = () => {
      if (current < 100) {
        // Fast, high-energy acceleration (completes in ~0.65 - 0.8s)
        let inc = 2.4 + Math.random() * 2.8
        if (current > 60 && current < 80) inc *= 1.2

        current = Math.min(100, current + inc)
        setProgress(Math.floor(current))

        if (current < 35) {
          setStatus('INITIALIZING')
        } else if (current < 70) {
          setStatus('CALIBRATING')
        } else if (current < 99) {
          setStatus('SYNCHRONIZING')
        }

        animRef.current = requestAnimationFrame(updateProgress)
      } else {
        setProgress(100)
        setStatus('SYSTEM READY')

        // Swift cinematic dismiss
        setTimeout(() => {
          setIsDismissed(true)
          document.body.style.overflow = ''
          if (onComplete) {
            onComplete()
          }

          setTimeout(() => {
            setIsDone(true)
          }, 500)
        }, 150)
      }
    }

    // Immediate kick-off
    animRef.current = requestAnimationFrame(updateProgress)
  }, [onComplete])

  if (isDone) return null

  return (
    <div className={`jarvis-preloader-root ${isDismissed ? 'dismissed' : ''}`}>
      <div className="jarvis-ambient-glow" />

      <div className="jarvis-preloader-stage">
        {/* Fluid Orbital System */}
        <div className="jarvis-core-rings">
          <svg
            className="jarvis-rings-svg"
            viewBox="0 0 310 310"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Deep Ambient Background Ring */}
            <circle
              cx="155"
              cy="155"
              r="145"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />

            {/* Outer Precision Sweeping Ring */}
            <g className="jarvis-orbital-sweep-outer">
              <circle
                cx="155"
                cy="155"
                r="145"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
                strokeDasharray="24 120 40 60 12 90"
                strokeLinecap="round"
              />
              <circle cx="155" cy="10" r="2.5" fill="#ffffff" />
              <circle cx="300" cy="155" r="2.5" fill="#ffffff" />
              <circle cx="155" cy="300" r="2.5" fill="#ffffff" />
              <circle cx="10" cy="155" r="2.5" fill="#ffffff" />
            </g>

            {/* Dynamic Dash Stream Flow */}
            <g className="jarvis-orbital-dash-flow">
              <circle
                cx="155"
                cy="155"
                r="124"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                strokeDasharray="35 70 15 40"
                strokeLinecap="round"
              />
            </g>

            {/* High Speed Orbiting Satellite Node with Path */}
            <g className="jarvis-orbital-satellite-ring">
              <circle
                cx="155"
                cy="155"
                r="102"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <circle
                cx="155"
                cy="53"
                r="3.5"
                fill="#ffffff"
                style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }}
              />
            </g>

            {/* Middle Precision Dial */}
            <g className="jarvis-orbital-middle-dial">
              <circle
                cx="155"
                cy="155"
                r="82"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
            </g>

            {/* Inner Reticle Crosshairs */}
            <g className="jarvis-orbital-inner-reticle">
              <line
                x1="155"
                y1="64"
                x2="155"
                y2="76"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
              />
              <line
                x1="155"
                y1="234"
                x2="155"
                y2="246"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
              />
              <line
                x1="64"
                y1="155"
                x2="76"
                y2="155"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
              />
              <line
                x1="234"
                y1="155"
                x2="246"
                y2="155"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
              />
            </g>
          </svg>

          {/* 3D Gyroscopic Quantum Core Gimbal */}
          <div className="jarvis-gyro-container">
            <div className="jarvis-gyro-sphere">
              <div className="jarvis-gyro-ring r1" />
              <div className="jarvis-gyro-ring r2" />
              <div className="jarvis-gyro-ring r3" />
            </div>
            <div className="jarvis-quantum-core-prism" />
          </div>
        </div>

        {/* Centered Percentage & Telemetry Group */}
        <div className="jarvis-telemetry-group">
          {/* Ubuntu Sans Percentage */}
          <div className="jarvis-percentage-wrap">
            <strong>{String(progress).padStart(3, '0')}</strong>
            <span className="jarvis-percentage-symbol">%</span>
          </div>

          {/* Hairline Loading Track */}
          <div className="jarvis-progress-track-box">
            <div className="jarvis-progress-track">
              <div
                className="jarvis-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Label */}
          <div
            className="jarvis-status-badge"
            style={{ color: progress === 100 ? '#ffffff' : '#717a8c' }}
          >
            {status}
          </div>
        </div>
      </div>
    </div>
  )
}
