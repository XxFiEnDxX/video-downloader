import DownloadForm from './components/DownloadForm'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <main className="main">
        <div className="container">
          <header className="header">
            <h1>Instagram Reel Downloader</h1>
            <p className="subtitle">
              Download Instagram reels easily and quickly - No login required
            </p>
          </header>

          <DownloadForm />

          <section className="howto">
            <h2>How to Download Instagram Reels</h2>
            <ol>
              <li>Open Instagram and find the reel you want to download</li>
              <li>Copy the reel URL from your browser or share link</li>
              <li>Paste the URL in the input field above</li>
              <li>Click "Download Reel" and wait for the download to complete</li>
            </ol>
          </section>

          <section className="features">
            <h2>Features</h2>
            <ul>
              <li>✅ Free and fast downloads</li>
              <li>✅ No login or registration required</li>
              <li>✅ High quality video downloads</li>
              <li>✅ Simple and easy to use</li>
              <li>✅ Works on all devices</li>
              <li>✅ Powered by yt-dlp (industry standard)</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>
          Instagram Reel Downloader - Download reels for personal use only.
          Respect content creators and Instagram's terms of service.
        </p>
      </footer>
    </div>
  )
}

export default App
