export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  image_url: string | null
  shopee_url: string | null
  tiktok_url: string | null
  others_url: string | null // Pengganti Tokopedia/Lazada/Web Lain
  review_url: string | null // Link video review atau artikel
  created_at: string
  is_trending?: boolean      
  is_featured?: boolean      
}

export const CATEGORIES = [
  'Semua',
  'Opsi Viral',
  'Opsi Gadget',
  'Opsi Rumah',
  'Opsi Fashion',
  'Opsi Lainya',
] as const

export type Category = (typeof CATEGORIES)[number]

// ── Supabase migration hint ───────────────────────────────────────────────────
// Run this in your Supabase SQL editor to add the new columns:
//
// ALTER TABLE products
//   ADD COLUMN IF NOT EXISTS is_trending   boolean DEFAULT false,
//   ADD COLUMN IF NOT EXISTS is_hemat      boolean DEFAULT false,
//   ADD COLUMN IF NOT EXISTS is_featured   boolean DEFAULT false,
//   ADD COLUMN IF NOT EXISTS video_url     text,
//   ADD COLUMN IF NOT EXISTS review_url    text,
//   ADD COLUMN IF NOT EXISTS tokopedia_url text,
//   ADD COLUMN IF NOT EXISTS lazada_url    text;