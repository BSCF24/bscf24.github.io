import type { ImageMetadata } from 'astro';

const imageModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpeg,jpg,png,gif,webp,svg,JPG,JPEG,PNG,WEBP,AVIF,avif}');

export async function getImageAsset(path: string | undefined | null): Promise<ImageMetadata | null> {
  if (!path) return null;

  // Normalize path
  let normalized = path.trim();
  if (normalized.startsWith('/contents/images/')) {
    normalized = normalized.replace('/contents/images/', '/src/assets/images/');
  } else if (normalized.startsWith('/initiatives/')) {
    normalized = normalized.replace('/initiatives/', '/src/assets/initiatives/');
  } else if (!normalized.startsWith('/src/assets/')) {
    normalized = `/src/assets/${normalized.replace(/^\//, '')}`;
  }

  if (imageModules[normalized]) {
    const mod = await imageModules[normalized]();
    return mod.default;
  }

  // Fallback: Case-insensitive match
  const lowerNormalized = normalized.toLowerCase();
  for (const [key, fn] of Object.entries(imageModules)) {
    if (key.toLowerCase() === lowerNormalized) {
      const mod = await fn();
      return mod.default;
    }
  }

  return null;
}
