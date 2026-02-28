import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // ── Other common image CDNs — add as needed ───────────────────────────
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      // Supabase Storage (replace YOUR_PROJECT_ID with your actual project ref)
      {
        protocol: 'https',
        hostname: 'ytspbehqupjsverrgdxa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Shopee CDN (for product images scraped from Shopee)
      {
        protocol: "https",
        hostname: "*.shopee.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cf.shopee.co.id",
        pathname: "/**",
      },
      // TikTok CDN
      {
        protocol: "https",
        hostname: "*.tiktokcdn.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
