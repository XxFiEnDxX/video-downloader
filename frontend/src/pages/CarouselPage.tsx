import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../styles/Page.css'

const CarouselPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <section className="page-content">
                    <div className="container">
                        <div className="content-card">
                            <h2 className="content-title">🎠 Carousel Downloads</h2>
                            <p className="content-description">
                                Download all images and videos from Instagram carousel posts. Get every photo and video
                                from multi-media posts in one go. Perfect for saving complete albums.
                            </p>
                            <div className="content-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>All Media</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Batch Download</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Original Order</span>
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

export default CarouselPage
