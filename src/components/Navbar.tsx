import React, { useState } from 'react'
import './Navbar.css'

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('main')

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="navbar-logo">
        <span className="logo-text">Horizon</span>
        <span className="logo-version">V2.2</span>
      </div>

      {/* Centered Minimalist Matte Glass Pill */}
      <nav className="navbar-pill">
        <a 
          href="#main" 
          className={`nav-item ${activeTab === 'main' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('main'); }}
        >
          Main
        </a>
        <a 
          href="#features" 
          className={`nav-item ${activeTab === 'features' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('features'); }}
        >
          Features
        </a>
        <a 
          href="#faq" 
          className={`nav-item ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }}
        >
          FAQ
        </a>
        <a 
          href="#pricing" 
          className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('pricing'); }}
        >
          Pricing
        </a>
      </nav>

      {/* Right Side Actions */}
      <div className="navbar-actions">
        <a href="#signin" className="nav-link-signin">Sign In</a>
        <button className="btn-start">Start for free</button>
      </div>
    </header>
  )
}

export default Navbar
