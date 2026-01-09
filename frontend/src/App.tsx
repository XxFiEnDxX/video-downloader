import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VideoPage from './pages/VideoPage'
import PhotoPage from './pages/PhotoPage'
import ReelsPage from './pages/ReelsPage'
import StoryPage from './pages/StoryPage'
import IgtvPage from './pages/IgtvPage'
import CarouselPage from './pages/CarouselPage'
import ViewerPage from './pages/ViewerPage'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/photo" element={<PhotoPage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/igtv" element={<IgtvPage />} />
        <Route path="/carousel" element={<CarouselPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
      </Routes>
    </div>
  )
}

export default App
