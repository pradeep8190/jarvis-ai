import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FAQ.css'

interface FAQItem {
  id: string
  cmd: string
  q: string
  a: string
}

export const FAQ: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('privacy')

  const faqs: FAQItem[] = [
    {
      id: 'privacy',
      cmd: 'query --data-privacy',
      q: 'Is my system data sent to the cloud?',
      a: 'No. Jarvis operates on a zero-cloud architecture. All parsing, local database searches, and script executions happen locally inside a sandboxed environment on your hardware. We do not store or transmit your documents, search history, or terminal logs.'
    },
    {
      id: 'gui',
      cmd: 'query --gui-override',
      q: 'How does the Laptop Control Agent work?',
      a: 'The Laptop Control Agent uses local accessibility protocols to interact with your desktop. If an application lacks a developer API, Jarvis scans your display coordinates and interacts with the user interface just like a human would.'
    },
    {
      id: 'agents',
      cmd: 'query --sub-agents',
      q: 'What kind of sub-agents does Jarvis deploy?',
      a: 'Jarvis automatically divides complex tasks into steps. Depending on the prompt, it spawns dedicated sub-agents: a file-system agent for deep searches, a terminal agent for administrative scripts, and an IoT link agent for smart home devices.'
    },
    {
      id: 'privileges',
      cmd: 'query --admin-privileges',
      q: 'Does it require administrator access?',
      a: 'You only need administrator credentials for system-level actions, such as controlling your Wi-Fi interface, locking screens, or managing network routing. All standard voice chat and file lookup tasks run in normal user space.'
    },
    {
      id: 'latency',
      cmd: 'query --response-loop',
      q: 'How is sub-second voice latency possible?',
      a: 'By bypassing standard cloud APIs. Jarvis binds direct voice streams to local sockets on your hardware and generates neural speech tokens in real-time, delivering a duplex response loop under a second.'
    }
  ]

  const activeFAQ = faqs.find(f => f.id === selectedId) || faqs[0]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // 1. Centered Header entrance (slides up and fades)
    gsap.fromTo('.faq-header-centered',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#faq',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )

    // 2. Left Terminal Column entry (slides in from left, slightly rotates and scales)
    gsap.fromTo('.faq-console-col',
      { 
        opacity: 0, 
        x: -70, 
        scale: 0.95,
        transformOrigin: 'left center'
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#faq',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    )

    // 3. Right Questions Rack entry (staggered cards slide in from right)
    gsap.fromTo('.faq-selector-btn',
      { 
        opacity: 0, 
        x: 70,
        scale: 0.98,
        transformOrigin: 'right center'
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.faq-selector-rack',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  return (
    <section className="faq-section" id="faq">
      
      {/* Centered Page Header */}
      <div className="faq-header-centered">
        <span className="faq-tagline">Access Protocols</span>
        <h2 className="faq-title">Frequently Asked Questions.</h2>
      </div>

      <div className="faq-container">
        
        {/* Left Side: Virtual Console */}
        <div className="faq-console-col">
          <div className="console-backlight"></div>
          <div className="faq-console-window">
            {/* Console Header Bar */}
            <div className="console-title-bar">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="console-title">console: /jarvis/interrogate</span>
            </div>

            {/* Console Content Screen */}
            <div className="console-screen">
              <div className="console-input-line">
                <span className="console-prompt">guest@jarvis:~$</span>
                <span className="console-input-cmd">{activeFAQ.cmd}</span>
              </div>

              {/* Dynamic Console Output Panel */}
              <div className="console-output-state" key={selectedId}>
                <p className="console-text-answer">{activeFAQ.a}</p>
                
                <div className="console-cursor-line">
                  <span className="console-prompt">guest@jarvis:~$</span>
                  <span className="blinking-cursor">_</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interrogation Selector */}
        <div className="faq-right-col">
          {/* Selector rack */}
          <div className="faq-selector-rack">
            {faqs.map((faq) => (
              <button
                className={`faq-selector-btn ${selectedId === faq.id ? 'active-selector' : ''}`}
                key={faq.id}
                onMouseEnter={() => setSelectedId(faq.id)}
                onClick={() => setSelectedId(faq.id)}
              >
                <div className="btn-indicator"></div>
                <div className="btn-text-content">
                  <span className="btn-q-text">{faq.q}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default FAQ
