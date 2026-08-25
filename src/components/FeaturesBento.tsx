import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FeaturesBento.css'

interface FeatureSlide {
  id: number
  indexLabel: string
  title: string
  desc: string
  visualType: 'agents' | 'voice' | 'gui' | 'shell' | 'defense' | 'network'
}

export const FeaturesBento: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const slides: FeatureSlide[] = [
    {
      id: 0,
      indexLabel: '01',
      title: 'Multi-Agent Orchestration',
      desc: 'Jarvis operates as a central cognitive commander, dynamically spawning and delegating workflows to specialized sub-agents on-demand with a sub-second response loop.',
      visualType: 'agents'
    },
    {
      id: 1,
      indexLabel: '02',
      title: 'Laptop Control Agent',
      desc: 'Direct OS override control. Spawns automated cursor pathways, clicks buttons, and enters text to drive native applications when direct API hooks don\'t exist.',
      visualType: 'gui'
    },
    {
      id: 2,
      indexLabel: '03',
      title: 'Native PowerShell',
      desc: 'Launches native command shell scripts with administrator privileges to manage files, apps, and hardware radios.',
      visualType: 'shell'
    },
    {
      id: 3,
      indexLabel: '04',
      title: 'Visual Presence Lock',
      desc: 'Locks your workspace instantly when your camera registers you walking away or detects an unknown face sitting down.',
      visualType: 'defense'
    },
    {
      id: 4,
      indexLabel: '05',
      title: 'Smart Home & Network Control',
      desc: 'Manage your local network security and bridge Jarvis directly to your Google Home ecosystem to control lights, climate, and connection clients.',
      visualType: 'network'
    }
  ]

  useEffect(() => {
    const track = scrollRef.current
    const trigger = triggerRef.current
    const container = containerRef.current
    if (!track || !trigger || !container) return

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Calculate total horizontal scroll width minus viewport width
    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth
    }

    // Pinned Horizontal scroll timeline
    const horizontalTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${track.scrollWidth * 0.95}`, // duration of pin scroll
        pin: true,
        scrub: 1.0,
        invalidateOnRefresh: true
      }
    })

    // Animate the horizontal track shift
    horizontalTimeline.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none'
    })

    // Premium 3D Perspective Stagger on cards as they slide into view horizontally
    const cards = track.querySelectorAll('.feature-card-inner')
    cards.forEach((card) => {
      gsap.fromTo(card,
        { 
          opacity: 0.25, 
          scale: 0.92, 
          rotateY: 15,
          z: -60
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          z: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTimeline, // Tie trigger to the horizontal motion
            start: 'left 92%',
            end: 'left 52%',
            scrub: true
          }
        }
      )
    })

    return () => {
      // Complete cleanup of ScrollTrigger animations
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section ref={containerRef} className="horizontal-scroll-section" id="features">
      <div ref={triggerRef} className="pin-viewport">
        <div ref={scrollRef} className="horizontal-track">
          
          {/* Slide 1: Welcome Intro Column (2 Columns) */}
          <div className="scroll-slide slide-intro">
            <div className="intro-left">
              <span className="slide-tag">Core Architecture</span>
              <h2 className="intro-heading">Engineered for local autonomy.</h2>
            </div>
            
            <div className="intro-right">
              <p className="intro-desc">
                Jarvis operates inside a secure sandboxed environment. Built as a raw extension of local hardware interfaces prioritizing raw throughput and zero cloud dependencies.
              </p>
              <div className="scroll-helper">
                <span className="helper-text">SCROLL DOWN TO TRAVERSE</span>
                <span className="helper-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Feature Slides */}
          {slides.map((slide) => (
            <div className="scroll-slide slide-card" key={slide.id}>
              <div className={`feature-card-inner ${
                slide.id === 0 
                  ? 'first-card-highlight' 
                  : slide.id === 1 
                    ? 'second-card-highlight' 
                    : slide.id === 2 
                      ? 'third-card-highlight' 
                      : slide.id === 3 
                        ? 'fourth-card-highlight' 
                        : slide.id === 4 
                          ? 'fifth-card-highlight' 
                          : ''
              }`}>
                
                {/* Top-Right Tip Corner Glow */}
                {(slide.id === 0 || slide.id === 1 || slide.id === 2 || slide.id === 3 || slide.id === 4) && (
                  <>
                    <div className="card-corner-glow"></div>
                    <div className="card-noise-dot"></div>
                  </>
                )}

                <div className="card-top">
                  <span className="card-index">{slide.indexLabel}</span>
                  <h3 className="card-title">{slide.title}</h3>
                  <p className="card-desc">{slide.desc}</p>
                </div>

                {/* Card Visual Content */}
                <div className="card-visual">
                  {slide.visualType === 'agents' && (
                    <div className="visual-agent-tree">
                      <div className="agent-core-node">
                        <span className="node-text">JARVIS</span>
                      </div>
                      <div className="sub-agent-node node-left">
                        <span className="node-label">FILE</span>
                      </div>
                      <div className="sub-agent-node node-right">
                        <span className="node-label">SHELL</span>
                      </div>
                      <div className="sub-agent-node node-bottom">
                        <span className="node-label">NET</span>
                      </div>
                      <svg className="agent-svg" viewBox="0 0 100 100">
                        <line x1="50" y1="50" x2="16" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="50" y1="50" x2="84" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="50" y1="50" x2="50" y2="84" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        
                        <circle cx="50" cy="50" r="1.5" className="pulse-left" fill="#ffffff" />
                        <circle cx="50" cy="50" r="1.5" className="pulse-right" fill="#ffffff" />
                        <circle cx="50" cy="50" r="1.5" className="pulse-bottom" fill="#ffffff" />
                      </svg>
                    </div>
                  )}

                  {slide.visualType === 'voice' && (
                    <div className="visual-voice-waves">
                      <div className="wave-line bar-1"></div>
                      <div className="wave-line bar-2"></div>
                      <div className="wave-line bar-3"></div>
                      <div className="wave-line bar-4"></div>
                      <div className="wave-line bar-5"></div>
                    </div>
                  )}

                  {slide.visualType === 'gui' && (
                    <div className="visual-gui-override">
                      <div className="virtual-screen">
                        <div className="virtual-cursor"></div>
                        <div className="virtual-target target-1"></div>
                        <div className="virtual-target target-2"></div>
                      </div>
                    </div>
                  )}

                  {slide.visualType === 'shell' && (
                    <div className="visual-shell-code">
                      <span>$ ./jarvis --run-core</span>
                      <span className="code-green">&gt; OK: SHELL INTERACT</span>
                      <span className="code-grey">&gt; EXECUTE ROUTINE</span>
                    </div>
                  )}

                  {slide.visualType === 'defense' && (
                    <div className="visual-lens-sweep">
                      <div className="iris-scanner"></div>
                      <div className="horizontal-lens-line"></div>
                    </div>
                  )}

                  {slide.visualType === 'network' && (
                    <div className="visual-nodes-cluster">
                      <div className="cluster-node c-node"></div>
                      <div className="cluster-node e-node n-1"></div>
                      <div className="cluster-node e-node n-2"></div>
                      <svg className="cluster-svg" viewBox="0 0 100 100">
                        <line x1="50" y1="50" x2="15" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="50" y1="50" x2="85" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default FeaturesBento
