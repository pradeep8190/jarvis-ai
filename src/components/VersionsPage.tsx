import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './VersionsPage.css'

interface Version {
  version: string
  tag: string
  date: string
  status: 'stable' | 'legacy' | 'beta'
  size: string
  description: string
  features: string[]
  downloadLink: string
}

export const VersionsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'stable' | 'beta' | 'legacy'>('all')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // 1. Header elements entrance animation
    const title = section.querySelector('.versions-title')
    const subtitle = section.querySelector('.versions-subtitle')
    const pills = section.querySelector('.filter-pills')

    gsap.fromTo([title, subtitle, pills], 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )

    // 2. Cards staggered fade-in slide-up
    const cards = section.querySelectorAll('.version-card')
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section.querySelector('.versions-grid'),
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )

      // 3. Scrub-based vertical parallax scroll shifts for each card
      cards.forEach((card, index) => {
        const yOffset = (index - 1) * 25 // Card 0: -25px, Card 1: 0px, Card 2: 25px offset
        
        gsap.to(card, {
          y: yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.0
          }
        })
      })
    }

    return () => {
      // Clean up ScrollTriggers for this rendering cycle
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [filter])

  const versions: Version[] = [
    {
      version: 'v2.2',
      tag: 'LATEST RELEASE',
      date: 'Aug 2026',
      status: 'stable',
      size: '24.8 MB',
      description: 'Flagship system with multi-agent orchestration, native laptop controller, and local terminal script validation.',
      features: [
        'Multi-Directory File Indexer',
        'OS / System Level Control API',
        'Secure Local Shell Runner'
      ],
      downloadLink: '#download-v2.2'
    },
    {
      version: 'v2.0',
      tag: 'STABLE CORE',
      date: 'Jan 2026',
      status: 'stable',
      size: '18.4 MB',
      description: 'Core system introducing advanced Natural Language Processing, file indexing, and trigger scheduling.',
      features: [
        'Static Directory Search',
        'Voice Preset Orchestrator',
        'Encrypted Task Scheduler'
      ],
      downloadLink: '#download-v2.0'
    },
    {
      version: 'v1.0',
      tag: 'LEGACY BASE',
      date: 'Oct 2025',
      status: 'legacy',
      size: '12.1 MB',
      description: 'First generation console client supporting basic voice synthesis and simple command line script triggers.',
      features: [
        'Terminal Command Listener',
        'Standard Audio Presets',
        'API Token Integration'
      ],
      downloadLink: '#download-v1.0'
    }
  ]

  const filteredVersions = versions.filter(v => {
    if (filter === 'all') return true
    return v.status === filter
  })

  const triggerDownload = (fileName: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ project: "Jarvis Configuration Generator", version: fileName, status: "READY" }, null, 2)
    )}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute('download', `jarvis_${fileName}_config.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <section className="versions-section" id="features" ref={sectionRef}>
      {/* Background soft ambient backlight */}
      <div className="versions-backlight"></div>

      <div className="versions-container">
        {/* Section Header */}
        <div className="versions-header">
          <h2 className="versions-title">Core Releases</h2>
          <p className="versions-subtitle">Select, configure, and download native Jarvis deployment modules.</p>
          
          {/* Pill Selector Filters */}
          <div className="filter-pills">
            <button 
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Builds
            </button>
            <button 
              className={`filter-pill ${filter === 'stable' ? 'active' : ''}`}
              onClick={() => setFilter('stable')}
            >
              Stable
            </button>
            <button 
              className={`filter-pill ${filter === 'legacy' ? 'active' : ''}`}
              onClick={() => setFilter('legacy')}
            >
              Legacy
            </button>
          </div>
        </div>

        {/* Versions Grid */}
        <div className="versions-grid">
          {filteredVersions.map((v) => (
            <div className={`version-card ${v.version === 'v2.2' ? 'active-release' : ''}`} key={v.version}>
              {v.version === 'v2.2' && <div className="card-ambient-glow"></div>}
              
              <div className="card-top">
                <div className="version-meta">
                  <span className="version-number">{v.version.toUpperCase()}</span>
                  <span className="version-badge">{v.tag}</span>
                </div>
                <span className="version-date">{v.date}</span>
              </div>

              <p className="version-desc">{v.description}</p>

              {/* Feature bullet list */}
              <div className="version-features">
                {v.features.map((feat, i) => (
                  <div className="feature-item" key={i}>
                    <svg className="feature-dot" width="6" height="6" viewBox="0 0 6 6" fill="none">
                      <circle cx="3" cy="3" r="2" fill="rgba(255, 255, 255, 0.45)" />
                    </svg>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="card-bottom">
                <span className="file-size">{v.size}</span>
                <button 
                  className="btn-download"
                  onClick={() => triggerDownload(v.version)}
                >
                  <span>Download Build</span>
                  <svg className="download-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {/* Bottom tray (static) */}
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    {/* Arrow (animates) */}
                    <g className="arrow-group">
                      <path d="M7 10l5 5 5-5M12 15V3" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VersionsPage
