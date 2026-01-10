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

    def get_video_info(self, url: str) -> Tuple[Optional[dict], Optional[str]]:
        """
        Extract Instagram video metadata and direct video URL using yt-dlp.
        Does NOT download the video - client will download directly.

        Returns:
            Tuple of (video_info_dict, error_message)
        """
        try:
            # Basic URL validation
            if not self.is_valid_url(url):
                return None, "Invalid Instagram URL. Please provide a valid Instagram link."

            # Configure yt-dlp options with anti-rate-limiting measures
            ydl_opts = {
                'format': 'best',  # Get best quality URL
                'quiet': True,  # Less verbose output
                'no_warnings': True,  # Suppress warnings
                'ignoreerrors': False,  # Fail on errors
                'extract_flat': False,  # Extract full metadata
                'skip_download': True,  # DON'T download - just extract metadata
                'retries': 5,  # Increased retries for rate limit issues
                # Anti-rate-limiting headers
                'http_headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                },
            }

            # Extract metadata using yt-dlp (no download)
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"Extracting video info from: {url}")

                # Extract info WITHOUT downloading
                info = ydl.extract_info(url, download=False)

                if not info:
                    return None, "Failed to extract video information."

                # Get direct video URL
                video_url = info.get('url')
                if not video_url:
                    return None, "Could not extract video URL."

                # Prepare metadata to return to client
                video_info = {
                    'video_url': video_url,
                    'thumbnail': info.get('thumbnail'),
                    'title': info.get('title', 'Instagram Video'),
                    'duration': info.get('duration'),
                    'width': info.get('width'),
                    'height': info.get('height'),
                    'ext': info.get('ext', 'mp4'),
                    'filesize': info.get('filesize'),
                }

                print(f"Extraction successful: {video_info['title']}")
                return video_info, None

        except yt_dlp.utils.DownloadError as e:
            error_msg = str(e)

            # Provide user-friendly error messages
            if "429" in error_msg or "too many requests" in error_msg.lower():
                return None, "Instagram rate limit reached. Please wait a few minutes and try again."
            elif "private" in error_msg.lower():
                return None, "This content is private. Please check the URL or try a public post."
            elif "not found" in error_msg.lower() or "404" in error_msg:
                return None, "Post not found. It may have been deleted or the URL is incorrect."
            elif "unsupported url" in error_msg.lower():
                return None, "This Instagram URL format is not supported."
            else:
                return None, f"Download failed: {error_msg}"

        except Exception as e:
            return None, f"An unexpected error occurred: {str(e)}"
