import '../styles/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">📥</span>
                <span className="logo-text">
                  Insta<span className="text-gradient">Saver</span>
                </span>
              </div>
              <p className="footer-description">
                Download Instagram Reels, Videos, Stories & IGTV for free. Fast, secure, and no login required.
              </p>
            </div>

            {/* Links Section */}
            <div className="footer-links">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-link-list">
                <li>
                  <button onClick={scrollToTop} className="footer-link">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('how-to')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link">
                    How To
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Info Section */}
            <div className="footer-info">
              <h3 className="footer-heading">Information</h3>
              <ul className="footer-link-list">
                <li>
                  <a href="#" className="footer-link">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="footer-link">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="footer-link">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="footer-link">About Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} InstaSaver. All rights reserved.
            </p>
            <p className="footer-disclaimer">
              Download content for personal use only. Respect content creators and Instagram's terms of service.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
