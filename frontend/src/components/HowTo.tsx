import '../styles/HowTo.css'

const HowTo = () => {
  const steps = [
    {
      number: '1',
      title: 'Copy Instagram URL',
      description: 'Open Instagram and find the reel, video, or story you want to download. Copy the URL from your browser or share button.',
      icon: '📋'
    },
    {
      number: '2',
      title: 'Paste URL Here',
      description: 'Paste the copied URL into the download box above and click the "Download Reel" button.',
      icon: '📥'
    },
    {
      number: '3',
      title: 'Download & Save',
      description: 'Preview the video in your browser, then click "Download Video" to save it to your device.',
      icon: '✅'
    }
  ]

  return (
    <section id="how-to" className="section howto-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            How to <span className="text-gradient">Download</span>
          </h2>
          <p className="section-subtitle lead">
            Download Instagram reels in 3 simple steps
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowTo
