import { useState, FormEvent } from 'react'
import '../styles/DownloadForm.css'

const DownloadForm = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFilename, setVideoFilename] = useState('instagram_reel.mp4')
  const [progress, setProgress] = useState(0)

  const handleDownloadFile = () => {
    if (!videoUrl) return

    const a = document.createElement('a')
    a.href = videoUrl
    a.download = videoFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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

      // Make request to backend (relative path works in both dev and production)
      const apiUrl = import.meta.env.DEV
        ? 'http://localhost:8000/api/download'  // Dev: separate servers
        : '/api/download';  // Production: same server

      console.log('Sending request to:', apiUrl)
      console.log('Request body:', { url })

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        clearInterval(progressInterval)
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.detail || 'Download failed')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Create blob URL for video preview
      const blobUrl = window.URL.createObjectURL(blob)

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'instagram_reel.mp4'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Complete progress
      clearInterval(progressInterval)
      setProgress(100)

      // Set video URL for preview
      setVideoUrl(blobUrl)
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
            {loading ? 'Downloading...' : 'Download Reel'}
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
            <p>Downloading your reel... {progress}%</p>
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
