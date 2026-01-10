import { useState, FormEvent } from 'react'
import '../styles/DownloadForm.css'
import { extractInstagramVideoURL, extractViaServer } from '../utils/instagramParser'

const DownloadForm = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFilename, setVideoFilename] = useState('instagram_reel.mp4')
  const [progress, setProgress] = useState(0)

  const handleDownloadFile = async () => {
    if (!videoUrl) return

    try {
      // Download video from Instagram using user's browser (their IP)
      // This avoids server rate limiting and uses user's bandwidth
      const response = await fetch(videoUrl)
      const blob = await response.blob()

      // Create blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = videoFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    } catch (err) {
      console.error('Download failed:', err)
      // Fallback: try direct link
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = videoFilename
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const handleClear = () => {
    setUrl('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setProgress(0)
    setVideoUrl(null)

    try {
      // Validate URL
      if (!url.trim()) {
        setError('Please enter a URL')
        setLoading(false)
        return
      }

      if (!url.includes('instagram.com')) {
        setError('Please enter a valid Instagram URL')
        setLoading(false)
        return
      }

      // Simulate progress (since we can't track real download progress easily)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      let videoInfo;

      try {
        // Try client-side extraction first (uses user's IP, bypasses VPS rate limits)
        console.log('Attempting client-side extraction...')
        videoInfo = await extractInstagramVideoURL(url)
        console.log('Client-side extraction successful:', videoInfo)
      } catch (clientError) {
        console.warn('Client-side extraction failed, trying server fallback:', clientError)

        try {
          // Fallback to server-side extraction (may hit rate limits on VPS)
          videoInfo = await extractViaServer(url)
          console.log('Server-side extraction successful:', videoInfo)
        } catch (serverError) {
          clearInterval(progressInterval)
          console.error('Both extraction methods failed:', serverError)
          throw new Error(
            serverError instanceof Error
              ? serverError.message
              : 'Failed to extract video. Please try again later.'
          )
        }
      }

      if (!videoInfo || !videoInfo.video_url) {
        clearInterval(progressInterval)
        throw new Error('Failed to get video URL')
      }

      // Complete progress
      clearInterval(progressInterval)
      setProgress(100)

      // Set video URL for preview (direct Instagram URL)
      setVideoUrl(videoInfo.video_url)

      // Generate filename from title or use default
      const filename = videoInfo.title
        ? `${videoInfo.title.replace(/[^a-z0-9]/gi, '_')}.mp4`
        : 'instagram_reel.mp4'
      setVideoFilename(filename)

      // Reset form
      setUrl('')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while downloading')
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Instagram reel URL here..."
              className="input"
              disabled={loading}
            />
            {!loading && (
              <button
                type="button"
                className="input-action-btn"
                onClick={url.trim() ? handleClear : handlePaste}
                aria-label={url.trim() ? 'Clear' : 'Paste'}
              >
                {url.trim() ? '✕' : '📋'}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Download Reel'}
          </button>
        </div>

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p>Extracting video info... {progress}%</p>
          </div>
        )}
      </form>

      {videoUrl && (
        <div className="video-container">
          <video
            src={videoUrl}
            controls
            className="video-player"
            loop
          >
            Your browser does not support the video tag.
          </video>
          <button
            onClick={handleDownloadFile}
            className="download-btn"
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadForm
