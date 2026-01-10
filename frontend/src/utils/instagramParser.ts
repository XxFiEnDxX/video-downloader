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
 * Get user's public IP address for debugging
 */
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('[IP Check] Could not fetch IP:', error);
    return 'unknown';
  }
}

/**
 * Extract video URL from Instagram page HTML
 * Instagram embeds video metadata in <script> tags as JSON
 */
export async function extractInstagramVideoURL(instagramUrl: string): Promise<VideoInfo> {
  console.log('[Client Extraction] Starting extraction for:', instagramUrl);
  console.log('[Client Extraction] User Agent:', navigator.userAgent);
  console.log('[Client Extraction] Location:', window.location.href);

  // Check user's IP for debugging
  const userIP = await getUserIP();
  console.log('[Client Extraction] 🌐 User Public IP:', userIP);
  console.log('[Client Extraction] This IP will be used for all Instagram requests');

  try {
    // Try multiple CORS proxies in case one fails
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(instagramUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(instagramUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(instagramUrl)}`,
    ];

    let html = '';
    let lastError: Error | null = null;

    for (let i = 0; i < proxies.length; i++) {
      const proxyUrl = proxies[i];
      console.log(`[Client Extraction] Attempt ${i + 1}/${proxies.length} - Using proxy:`, proxyUrl);

      try {
        console.log('[Client Extraction] Fetching Instagram page...');
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          }
        });

        console.log('[Client Extraction] Response status:', response.status);
        console.log('[Client Extraction] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          console.warn(`[Client Extraction] Proxy ${i + 1} failed with status:`, response.status);
          lastError = new Error(`Proxy failed: ${response.status} ${response.statusText}`);
          continue; // Try next proxy
        }

        console.log('[Client Extraction] ✅ Proxy succeeded! Parsing HTML...');
        html = await response.text();
        console.log('[Client Extraction] HTML length:', html.length);
        break; // Success! Exit loop
      } catch (error) {
        console.warn(`[Client Extraction] Proxy ${i + 1} error:`, error);
        lastError = error as Error;
        continue; // Try next proxy
      }
    }

    // If all proxies failed
    if (!html) {
      console.error('[Client Extraction] ❌ All CORS proxies failed');
      throw lastError || new Error('All CORS proxies failed');
    }

    // Instagram embeds video data in various script tags
    // Try multiple methods to extract video URL

    // Instagram 2024/2025 embeds data in multiple ways - try all of them

    console.log('[Client Extraction] Method 1: Searching for video_url in GraphQL data...');
    // Method 1: Look for video_url in embedded GraphQL/JSON data
    const videoUrlPatterns = [
      /"video_url":"([^"]+)"/,
      /"playback_url":"([^"]+)"/,
      /"src":"(https:\/\/[^"]*\.mp4[^"]*)"/,
    ];

    for (const pattern of videoUrlPatterns) {
      const match = html.match(pattern);
      if (match) {
        console.log('[Client Extraction] ✅ Found video_url via Method 1');
        const videoUrl = match[1].replace(/\\u0026/g, '&').replace(/\\//g, '/');
        console.log('[Client Extraction] Video URL:', videoUrl.substring(0, 100) + '...');

        // Extract additional metadata
        const thumbnailMatch = html.match(/"display_url":"([^"]+)"/);
        const titleMatch = html.match(/"title":"([^"]+)"/);

        const result = {
          video_url: videoUrl,
          thumbnail: thumbnailMatch ? thumbnailMatch[1].replace(/\\//g, '/') : undefined,
          title: titleMatch ? titleMatch[1] : 'Instagram Video',
        };

        console.log('[Client Extraction] Extraction successful!', result);
        return result;
      }
    }

    console.log('[Client Extraction] Method 2: Searching for og:video meta tag...');
    // Method 2: Look for og:video meta tag
    const ogVideoMatch = html.match(/<meta property="og:video(?::secure_url)?" content="([^"]+)"/);
    if (ogVideoMatch) {
      console.log('[Client Extraction] ✅ Found video via Method 2 (og:video)');
      const result = {
        video_url: ogVideoMatch[1],
        title: 'Instagram Video',
      };
      console.log('[Client Extraction] Extraction successful!', result);
      return result;
    }

    console.log('[Client Extraction] Method 3: Searching for JSON-LD structured data...');
    // Method 3: Look for JSON-LD structured data
    const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">(.+?)<\/script>/gs);
    for (const match of jsonLdMatches) {
      try {
        const jsonData = JSON.parse(match[1]);
        console.log('[Client Extraction] Found JSON-LD data:', jsonData);

        // Check multiple possible paths
        const videoUrl = jsonData?.video?.contentUrl ||
                        jsonData?.contentUrl ||
                        (Array.isArray(jsonData) ? jsonData[0]?.video?.contentUrl : null);

        if (videoUrl) {
          console.log('[Client Extraction] ✅ Found video via Method 3 (JSON-LD)');
          const result = {
            video_url: videoUrl,
            thumbnail: jsonData?.video?.thumbnailUrl || jsonData?.thumbnailUrl,
            title: jsonData?.video?.caption || jsonData?.caption || 'Instagram Video',
          };
          console.log('[Client Extraction] Extraction successful!', result);
          return result;
        }
      } catch (e) {
        console.warn('[Client Extraction] JSON-LD parsing failed:', e);
      }
    }

    console.log('[Client Extraction] Method 4: Searching for window._sharedData...');
    // Method 4: Extract from window._sharedData (Instagram's main data object)
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});<\/script>/s);
    if (sharedDataMatch) {
      try {
        const sharedData = JSON.parse(sharedDataMatch[1]);
        console.log('[Client Extraction] Found _sharedData');

        // Navigate through Instagram's data structure
        const postData = sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media ||
                        sharedData?.entry_data?.DesktopPPage?.[0]?.graphql?.shortcode_media;

        const videoUrl = postData?.video_url;

        if (videoUrl) {
          console.log('[Client Extraction] ✅ Found video via Method 4 (_sharedData)');
          const result = {
            video_url: videoUrl,
            thumbnail: postData?.display_url,
            title: postData?.edge_media_to_caption?.edges?.[0]?.node?.text || 'Instagram Video',
          };
          console.log('[Client Extraction] Extraction successful!', result);
          return result;
        }
      } catch (e) {
        console.warn('[Client Extraction] _sharedData parsing failed:', e);
      }
    }

    console.log('[Client Extraction] Method 5: Searching for xdt_api__v1__media data...');
    // Method 5: Modern Instagram API embedded data
    const xdtApiMatch = html.match(/"xdt_api__v1__media__shortcode__web_info"[^{]*({.+?})(?=,"HttpRequest")/s);
    if (xdtApiMatch) {
      try {
        const apiData = JSON.parse(xdtApiMatch[1]);
        console.log('[Client Extraction] Found xdt_api data');

        const items = apiData?.items;
        if (items && items.length > 0) {
          const videoVersions = items[0]?.video_versions;
          if (videoVersions && videoVersions.length > 0) {
            const videoUrl = videoVersions[0].url;
            console.log('[Client Extraction] ✅ Found video via Method 5 (xdt_api)');
            const result = {
              video_url: videoUrl,
              thumbnail: items[0]?.image_versions2?.candidates?.[0]?.url,
              title: items[0]?.caption?.text || 'Instagram Video',
            };
            console.log('[Client Extraction] Extraction successful!', result);
            return result;
          }
        }
      } catch (e) {
        console.warn('[Client Extraction] xdt_api parsing failed:', e);
      }
    }

    console.error('[Client Extraction] ❌ All extraction methods failed');
    console.log('[Client Extraction] HTML preview (first 500 chars):', html.substring(0, 500));

    // DEBUG: Save full HTML to console for manual inspection
    console.log('[Client Extraction] 🔍 FULL HTML for debugging:');
    console.log(html);

    // Also try to download HTML as file for easier inspection
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram_page.html';
    console.log('[Client Extraction] 💾 Downloading HTML file for inspection...');
    a.click();
    URL.revokeObjectURL(url);

    throw new Error('Could not extract video URL from Instagram page');
  } catch (error) {
    console.error('[Client Extraction] ❌ Fatal error:', error);
    if (error instanceof Error) {
      console.error('[Client Extraction] Error message:', error.message);
      console.error('[Client Extraction] Error stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Fallback: Use server-side extraction if client-side fails
 * This is the current method but may hit rate limits
 */
export async function extractViaServer(instagramUrl: string): Promise<VideoInfo> {
  console.log('[Server Extraction] Starting server-side extraction...');
  console.log('[Server Extraction] Instagram URL:', instagramUrl);

  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:8000/api/download'
    : '/api/download';

  console.log('[Server Extraction] API endpoint:', apiUrl);
  console.log('[Server Extraction] Sending request to backend...');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: instagramUrl }),
  });

  console.log('[Server Extraction] Response status:', response.status);
  console.log('[Server Extraction] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorData = await response.json();
    console.error('[Server Extraction] ❌ Server error:', errorData);
    throw new Error(errorData.detail || 'Server extraction failed');
  }

  const data = await response.json();
  console.log('[Server Extraction] Server response data:', data);

  if (!data.success || !data.video_url) {
    console.error('[Server Extraction] ❌ Invalid response from server');
    throw new Error('Failed to get video URL from server');
  }

  console.log('[Server Extraction] ✅ Server extraction successful');
  return {
    video_url: data.video_url,
    thumbnail: data.thumbnail,
    title: data.title,
    duration: data.duration,
    width: data.width,
    height: data.height,
  };
}
