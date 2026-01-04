import { useState } from 'react'
import '../styles/Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="header-main">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="navbar-brand">
              <a href="/" className="logo">
                <span className="logo-icon">📥</span>
                <span className="logo-text">
                  Insta<span className="text-gradient">Saver</span>
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <ul className="navbar-menu desktop-menu">
              <li>
                <button onClick={() => scrollToSection('how-to')} className="nav-link">
                  How To
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="nav-link">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="nav-link">
                  FAQ
                </button>
              </li>
            </ul>

            {/* Mobile Menu Toggle */}
            <button
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="mobile-menu-list">
              <li>
                <button onClick={() => scrollToSection('how-to')} className="nav-link">
                  How To
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="nav-link">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="nav-link">
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
