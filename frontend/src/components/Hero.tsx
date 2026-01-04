import DownloadForm from './DownloadForm'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-header fade-in">
            <h1 className="hero-title">
              Instagram Reel <span className="text-gradient">Downloader</span>
            </h1>
            <p className="hero-subtitle">
              Download Instagram Reels, Videos, Stories & IGTV for free. Fast, secure, and no login required.
            </p>
          </div>

          <div className="hero-form">
            <DownloadForm />
          </div>

          <div className="hero-badges">
            <div className="badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">100% Free</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Secure & Safe</span>
            </div>
            <div className="badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-text">Super Fast</span>
            </div>
            <div className="badge">
              <span className="badge-icon">∞</span>
              <span className="badge-text">Unlimited</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
