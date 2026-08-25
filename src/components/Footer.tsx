import React from 'react'
import './Footer.css'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Left Side: Slogan, Subheading, and Premium Rounded Button */}
        <div className="footer-left">
          <h2 className="footer-heading">Automate your horizon.</h2>
          <p className="footer-subheading">A sandboxed, ultra-low latency system core for hardware and workflow control.</p>
          <a href="#orchestrator" className="btn-footer-download">
            <span>Compile Jarvis Core</span>
            <svg className="arrow-diagonal" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>

        {/* Right Side: Columns of bullet-prefixed links */}
        <div className="footer-right">
          <div className="footer-link-column">
            <a href="#main" className="footer-link-item">Overview</a>
            <a href="#features" className="footer-link-item">Core Releases</a>
            <a href="#orchestrator" className="footer-link-item">Capabilities</a>
          </div>
          <div className="footer-link-column">
            <a href="#privacy" className="footer-link-item">Privacy Policy</a>
            <a href="#terms" className="footer-link-item">Terms & Conditions</a>
            <a href="#releases" className="footer-link-item">Release Notes</a>
          </div>
        </div>
      </div>

      {/* Massive Background Brand Title */}
      <div className="footer-huge-background-text">
        HORIZON
      </div>

      {/* Bottom Bar Details */}
      <div className="footer-bottom">
        <span className="copyright-text">
          &copy; {currentYear} Horizon Inc. All rights reserved.
        </span>
        <span className="footer-designer-tag">
          Designed for Windows & macOS
        </span>
      </div>
    </footer>
  )
}

export default Footer
