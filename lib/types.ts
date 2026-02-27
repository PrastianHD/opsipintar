export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  image_url: string | null
  shopee_url: string | null
  tiktok_url: string | null
  created_at: string
}

export const CATEGORIES = [
  'Semua',
  'Opsi Viral',
  'Gadget',
  'Rumah',
  'Hemat',
  'Solusi',
] as const

export type Category = (typeof CATEGORIES)[number]
