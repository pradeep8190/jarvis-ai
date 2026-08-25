import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import HeroPage from './components/HeroPage'
import VersionsPage from './components/VersionsPage'
import ConfiguratorPage from './components/ConfiguratorPage'
import FeaturesBento from './components/FeaturesBento'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple style easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false
    })

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Hook Lenis into GSAP requestAnimationFrame ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Turn off lag smoothing for GSAP so ScrollTrigger updates instantaneously
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <main>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <HeroPage isReady={isLoaded} />
      <FeaturesBento />
      <VersionsPage />
      <ConfiguratorPage />
      <Pricing />
      <FAQ />
      <Testimonials />
      <Footer />
    </main>
  )
}

export default App


