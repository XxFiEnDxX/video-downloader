from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
from downloader import ReelDownloader
from concurrent.futures import ThreadPoolExecutor
import asyncio
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
    allow_origins=["http://localhost:5847", "http://localhost:3000"],  # Dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize downloader (extracts metadata only, no actual downloads)
# Downloads directory kept for future use or temporary files
downloader = ReelDownloader(download_dir="../downloads")

# Thread pool for running blocking yt-dlp metadata extraction
# 10 threads per worker allows handling multiple extractions concurrently
executor = ThreadPoolExecutor(max_workers=10)


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
    Extract Instagram video metadata and direct video URL.

    Client will download the video directly from Instagram using the returned URL.
    This avoids server-side rate limiting and storage issues.

    Returns JSON with video_url and metadata.
    """
    url = request.url.strip()

    # Validate URL format
    if not downloader.is_valid_url(url):
        raise HTTPException(
            status_code=400,
            detail="Invalid Instagram URL. Please provide a valid reel or post URL."
        )

    # Extract video info in thread pool (non-blocking)
    # This allows handling multiple extractions concurrently
    loop = asyncio.get_running_loop()
    video_info, error = await loop.run_in_executor(
        executor,
        downloader.get_video_info,
        url
    )

    if error:
        raise HTTPException(status_code=400, detail=error)

    if not video_info or not video_info.get('video_url'):
        raise HTTPException(
            status_code=500,
            detail="Failed to extract video information. Please try again."
        )

    # Return video metadata and direct URL
    return {
        "success": True,
        "video_url": video_info['video_url'],
        "thumbnail": video_info.get('thumbnail'),
        "title": video_info.get('title'),
        "duration": video_info.get('duration'),
        "width": video_info.get('width'),
        "height": video_info.get('height'),
        "ext": video_info.get('ext'),
        "filesize": video_info.get('filesize')
    }


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
