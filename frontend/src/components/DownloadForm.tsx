import { useState, FormEvent } from 'react'
import '../styles/DownloadForm.css'

const DownloadForm = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.detail || 'Download failed')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'instagram_reel.mp4'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      // Reset form
      setUrl('')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while downloading')
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram reel URL here..."
            className="input"
            disabled={loading}
          />
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
            <div className="spinner"></div>
            <p>Downloading your reel... This may take a few moments.</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default DownloadForm
