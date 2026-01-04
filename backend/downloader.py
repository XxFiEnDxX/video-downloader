import yt_dlp
from pathlib import Path
from typing import Optional, Tuple
import time


class ReelDownloader:
    def __init__(self, download_dir: str = "downloads"):
        self.download_dir = Path(download_dir)
        self.download_dir.mkdir(exist_ok=True)

    def is_valid_url(self, url: str) -> bool:
        """
        Validate Instagram URL.

        Simple domain check - yt-dlp handles all Instagram URL formats:
        - /reel/, /reels/, /p/, /tv/, /stories/, etc.
        """
        return 'instagram.com/' in url.lower()

    def download_reel(self, url: str) -> Tuple[Optional[Path], Optional[str]]:
        """
        Download Instagram reel/post/video from URL using yt-dlp.

        Returns:
            Tuple of (video_path, error_message)
        """
        try:
            # Basic URL validation
            if not self.is_valid_url(url):
                return None, "Invalid Instagram URL. Please provide a valid Instagram link."

            # Create unique directory for this download
            timestamp = int(time.time())
            download_path = self.download_dir / f"download_{timestamp}"
            download_path.mkdir(exist_ok=True)

            # Configure yt-dlp options
            ydl_opts = {
                'format': 'best',  # Download best quality
                'outtmpl': str(download_path / '%(id)s.%(ext)s'),  # Output template
                'quiet': True,  # Less verbose output
                'no_warnings': True,  # Suppress warnings
                'ignoreerrors': False,  # Fail on errors
                'extract_flat': False,  # Extract full metadata
                'retries': 3,  # Retry failed downloads
                # Optional: Add cookies support for private content (future)
                # 'cookiefile': 'cookies.txt',
            }

            # Download using yt-dlp
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"Downloading from: {url}")

                # Extract info and download
                info = ydl.extract_info(url, download=True)

                if not info:
                    return None, "Failed to extract video information."

                # Get the exact downloaded file path from yt-dlp metadata
                if 'requested_downloads' in info and len(info['requested_downloads']) > 0:
                    video_path = Path(info['requested_downloads'][0]['filepath'])
                else:
                    # Fallback: construct path from metadata
                    video_id = info.get('id', 'video')
                    ext = info.get('ext', 'mp4')
                    video_path = download_path / f"{video_id}.{ext}"

                # Verify file exists
                if not video_path.exists():
                    return None, "Video file not found after download."

                print(f"Download successful: {video_path}")
                return video_path, None

        except yt_dlp.utils.DownloadError as e:
            error_msg = str(e)

            # Provide user-friendly error messages
            if "private" in error_msg.lower():
                return None, "This content is private. Please check the URL or try a public post."
            elif "not found" in error_msg.lower() or "404" in error_msg:
                return None, "Post not found. It may have been deleted or the URL is incorrect."
            elif "unsupported url" in error_msg.lower():
                return None, "This Instagram URL format is not supported."
            else:
                return None, f"Download failed: {error_msg}"

        except Exception as e:
            return None, f"An unexpected error occurred: {str(e)}"
