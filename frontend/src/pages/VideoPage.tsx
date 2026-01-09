import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../styles/Page.css'

const VideoPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <section className="page-content">
                    <div className="container">
                        <div className="content-card">
                            <h2 className="content-title">📹 Video Downloads</h2>
                            <p className="content-description">
                                Download Instagram videos in high quality. Simply paste the video URL above and click download.
                                Our tool supports all Instagram video formats and ensures the best quality available.
                            </p>
                            <div className="content-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>HD Quality</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Fast Download</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>No Watermark</span>
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

export default VideoPage
