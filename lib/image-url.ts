/**
 * lib/image-url.ts
 *
 * Sanitizes product image URLs before passing to next/image.
 *
 * Problem: Supabase rows sometimes store Unsplash URLs with extra params like
 *   ?w=400&h=400&fit=crop  →  these cause 404 from Unsplash CDN
 *
 * Fix: Strip all query params from Unsplash URLs and let Next.js Image
 * optimisation handle sizing via its own /_next/image pipeline.
 */

const UNSPLASH_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
]

/**
 * Returns a clean image URL safe for next/image src.
 * - Strips rogue query params from Unsplash URLs
 * - Returns null if the URL is empty / clearly broken
 */
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null

  try {
    const parsed = new URL(url)

    // Fix Unsplash: remove all existing query params
    // Next.js Image will add ?w=&q= via its own loader
    if (UNSPLASH_HOSTS.includes(parsed.hostname)) {
      parsed.search = ""
      return parsed.toString()
    }

    // All other URLs: return as-is
    return url
  } catch {
    // URL constructor threw — malformed URL
    return null
  }
}

/**
 * Generates a clean Unsplash URL from a photo ID.
 * Use this when inserting seed data into Supabase.
 *
 * ✅ Correct:  https://images.unsplash.com/photo-1558618666-fcd25c85f82e
 * ❌ Wrong:    https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop
 */
export function unsplashUrl(photoId: string): string {
  return `https://images.unsplash.com/${photoId}`
}
