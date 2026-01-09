import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../styles/Page.css'

const StoryPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <section className="page-content">
                    <div className="container">
                        <div className="content-card">
                            <h2 className="content-title">⭐ Story Downloads</h2>
                            <p className="content-description">
                                Download Instagram Stories before they disappear. Save photos and videos from stories
                                anonymously. Perfect for preserving temporary content you don't want to miss.
                            </p>
                            <div className="content-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Anonymous</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>24h Access</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Photo & Video</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default StoryPage
