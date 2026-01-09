import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

const Navigation = () => {
    const location = useLocation()

    const tabs = [
        { path: '/video', label: 'Video', icon: '📹' },
        { path: '/photo', label: 'Photo', icon: '📷' },
        { path: '/reels', label: 'Reels', icon: '🎬' },
        { path: '/story', label: 'Story', icon: '⭐' },
        { path: '/igtv', label: 'IGTV', icon: '📺' },
        { path: '/carousel', label: 'Carousel', icon: '🎠' },
        { path: '/viewer', label: 'Viewer', icon: '👁️' },
    ]

    return (
        <nav className="navigation">
            <div className="container">
                <div className="nav-tabs">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
                        >
                            <span className="nav-tab-icon">{tab.icon}</span>
                            <span className="nav-tab-label">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navigation
