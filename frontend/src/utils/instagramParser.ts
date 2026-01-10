/**
 * Client-side Instagram video URL extractor
 * Parses Instagram page HTML to extract video URL without using server
 * This bypasses VPS rate limiting by using user's residential IP
 */

interface VideoInfo {
  video_url: string;
  thumbnail?: string;
  title?: string;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Extract video URL from Instagram page HTML
 * Instagram embeds video metadata in <script> tags as JSON
 */
export async function extractInstagramVideoURL(instagramUrl: string): Promise<VideoInfo> {
  try {
    // Use CORS proxy to fetch Instagram page from client
    // This uses the USER's IP, not the VPS IP
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(instagramUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram page');
    }

    const html = await response.text();

    // Instagram embeds video data in various script tags
    // Try multiple methods to extract video URL

    // Method 1: Look for video_url in script tags
    const videoUrlMatch = html.match(/"video_url":"([^"]+)"/);
    if (videoUrlMatch) {
      const videoUrl = videoUrlMatch[1].replace(/\\u0026/g, '&');

      // Extract additional metadata
      const thumbnailMatch = html.match(/"display_url":"([^"]+)"/);
      const titleMatch = html.match(/"title":"([^"]+)"/);

      return {
        video_url: videoUrl,
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : undefined,
        title: titleMatch ? titleMatch[1] : 'Instagram Video',
      };
    }

    // Method 2: Look for og:video meta tag
    const ogVideoMatch = html.match(/<meta property="og:video" content="([^"]+)"/);
    if (ogVideoMatch) {
      return {
        video_url: ogVideoMatch[1],
        title: 'Instagram Video',
      };
    }

    // Method 3: Look for JSON-LD structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        if (jsonData.video && jsonData.video.contentUrl) {
          return {
            video_url: jsonData.video.contentUrl,
            thumbnail: jsonData.video.thumbnailUrl,
            title: jsonData.video.caption || 'Instagram Video',
          };
        }
      } catch (e) {
        // JSON parsing failed, continue to next method
      }
    }

    throw new Error('Could not extract video URL from Instagram page');
  } catch (error) {
    console.error('Instagram extraction error:', error);
    throw error;
  }
}

/**
 * Fallback: Use server-side extraction if client-side fails
 * This is the current method but may hit rate limits
 */
export async function extractViaServer(instagramUrl: string): Promise<VideoInfo> {
  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:8000/api/download'
    : '/api/download';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: instagramUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Server extraction failed');
  }

  const data = await response.json();

  if (!data.success || !data.video_url) {
    throw new Error('Failed to get video URL from server');
  }

  return {
    video_url: data.video_url,
    thumbnail: data.thumbnail,
    title: data.title,
    duration: data.duration,
    width: data.width,
    height: data.height,
  };
}
