import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../styles/Page.css'

const IgtvPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <section className="page-content">
                    <div className="container">
                        <div className="content-card">
                            <h2 className="content-title">📺 IGTV Downloads</h2>
                            <p className="content-description">
                                Download long-form IGTV videos in full quality. Save extended content, tutorials, and vlogs
                                from your favorite creators. Supports all IGTV video lengths.
                            </p>
                            <div className="content-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Long Videos</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>High Quality</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Full Length</span>
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

export default IgtvPage
