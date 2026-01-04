import '../styles/Features.css'

const Features = () => {
  const features = [
    {
      icon: '💯',
      title: '100% Free',
      description: 'Download unlimited Instagram reels without any charges or subscriptions'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Your privacy is protected. We don\'t store any videos or personal data'
    },
    {
      icon: '⚡',
      title: 'Super Fast',
      description: 'Lightning-fast downloads in just a few seconds with high-speed servers'
    },
    {
      icon: '🎥',
      title: 'High Quality',
      description: 'Download videos in the best available quality including HD and 4K'
    },
    {
      icon: '📱',
      title: 'All Devices',
      description: 'Works perfectly on iPhone, Android, Windows, macOS, and Linux'
    },
    {
      icon: '🚫',
      title: 'No Watermark',
      description: 'Downloaded videos are clean without any watermarks or logos'
    },
    {
      icon: '∞',
      title: 'Unlimited Downloads',
      description: 'No limits on the number of videos you can download per day'
    },
    {
      icon: '🔓',
      title: 'No Registration',
      description: 'Start downloading immediately without creating an account or logging in'
    },
    {
      icon: '🎨',
      title: 'User Friendly',
      description: 'Simple and intuitive interface that anyone can use easily'
    }
  ]

  return (
    <section id="features" className="section features-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="section-subtitle lead">
            Everything you need to download Instagram content effortlessly
          </p>
        </div>

        <div className="features-grid grid grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon card-icon">
                <span>{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
