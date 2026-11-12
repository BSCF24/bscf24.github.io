export interface VideoEmbedInfo {
  type: 'iframe' | 'video';
  src: string;
}

/**
 * Parses a YouTube URL (watch, shorts, embed, youtu.be) and returns the standard embed URL.
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/i
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Parses a video URL or local path and returns embed details.
 * Supports:
 * - YouTube (watch, youtu.be, shorts, embed) -> https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - Facebook public video links -> https://www.facebook.com/plugins/video.php?href=ENCODED_URL&show_text=false
 * - Vimeo -> https://player.vimeo.com/video/VIDEO_ID
 * - Local / direct video paths (.mp4, /path/to/video.mp4) -> direct video element
 */
export function getVideoEmbedInfo(url?: string): VideoEmbedInfo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/i
  );
  if (ytMatch) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
    };
  }

  // 2. Facebook
  if (/facebook\.com|fb\.watch/i.test(trimmed)) {
    return {
      type: 'iframe',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false`
    };
  }

  // 3. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // 4. Local or direct video file (.mp4, etc.)
  return {
    type: 'video',
    src: trimmed
  };
}
