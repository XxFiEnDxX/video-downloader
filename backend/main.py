from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
from downloader import ReelDownloader
import os

app = FastAPI(
    title="Instagram Reel Downloader API",
    description="Download Instagram reels using yt-dlp",
    version="2.0.0"
)

# Configure CORS - only needed in development
# In production, frontend is served from same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize downloader (no credentials needed with yt-dlp)
downloader = ReelDownloader(download_dir="../downloads")


class DownloadRequest(BaseModel):
    url: str


# API Routes (all under /api prefix)
@app.get("/api")
async def api_root():
    """API information endpoint."""
    return {
        "status": "ok",
        "message": "Instagram Reel Downloader API - Powered by yt-dlp",
        "version": "2.0.0"
    }


@app.post("/api/download")
async def download_reel(request: DownloadRequest):
    """
    Download Instagram reel from provided URL.

    Returns the video file directly.
    """
    url = request.url.strip()

    # Validate URL format
    if not downloader.is_valid_url(url):
        raise HTTPException(
            status_code=400,
            detail="Invalid Instagram URL. Please provide a valid reel or post URL."
        )

    # Download the reel
    video_path, error = downloader.download_reel(url)

    if error:
        raise HTTPException(status_code=400, detail=error)

    if not video_path or not video_path.exists():
        raise HTTPException(
            status_code=500,
            detail="Video download failed. Please try again."
        )

    # Return the video file
    return FileResponse(
        path=str(video_path),
        media_type="video/mp4",
        filename=f"instagram_reel.mp4",
        headers={
            "Content-Disposition": 'attachment; filename="instagram_reel.mp4"'
        }
    )


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "downloader": "yt-dlp"}


# Static file serving (for production)
# Serve React build files
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    # Mount static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")

    # Serve index.html for all non-API routes (SPA fallback)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve React SPA for all non-API routes."""
        # Don't interfere with API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")

        index_file = static_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        else:
            raise HTTPException(status_code=404, detail="Frontend not built. Run: cd frontend && npm run build")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
