import { useState } from 'react'
import '../styles/FAQ.css'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Is this Instagram Reel Downloader free?',
      answer: 'Yes, our Instagram Reel Downloader is completely free to use. You can download unlimited reels, videos, and stories without any charges or subscriptions.'
    },
    {
      question: 'Do I need to log in to download Instagram reels?',
      answer: 'No, you don\'t need to log in or create an account. Simply paste the Instagram URL and download your content instantly without any registration.'
    },
    {
      question: 'What formats are supported?',
      answer: 'We support MP4 video format for all Instagram content including reels, videos, stories, and IGTV. Videos are downloaded in the best available quality.'
    },
    {
      question: 'Is it safe to use this downloader?',
      answer: 'Yes, our Instagram Reel Downloader is 100% safe and secure. We don\'t store any videos or personal data. Your privacy is completely protected.'
    },
    {
      question: 'Can I download private Instagram content?',
      answer: 'No, you can only download public Instagram content. Private accounts and their content cannot be downloaded without proper authorization.'
    },
    {
      question: 'How long does it take to download a reel?',
      answer: 'Download times vary based on video length and your internet speed. Most reels download within 5-10 seconds with our high-speed servers.'
    },
    {
      question: 'Are downloaded videos watermark-free?',
      answer: 'Yes, all downloaded videos are clean and don\'t have any watermarks or logos added by our service.'
    },
    {
      question: 'Which devices can I use this on?',
      answer: 'Our downloader works on all devices including Windows, macOS, Linux, Android, and iOS. It\'s completely browser-based and requires no installation.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="section-subtitle lead">
            Everything you need to know about downloading Instagram reels
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
