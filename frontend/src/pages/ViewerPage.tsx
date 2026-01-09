import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import '../styles/Page.css'

const ViewerPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <section className="page-content">
                    <div className="container">
                        <div className="content-card">
                            <h2 className="content-title">👁️ Instagram Viewer</h2>
                            <p className="content-description">
                                View Instagram content anonymously without an account. Browse profiles, posts, and stories
                                privately. No login required, completely anonymous viewing experience.
                            </p>
                            <div className="content-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Anonymous</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>No Login</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Private Viewing</span>
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

export default ViewerPage
