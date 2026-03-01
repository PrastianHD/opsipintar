// app/api/upload-image-from-url/route.ts
// Dipanggil dari add-product page ketika n8n return imageUrl dari Shopee.
// Karena browser tidak bisa fetch Shopee image langsung (CORS), kita proxy lewat server ini.

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    // 1. Download image dari URL (Shopee CDN)
    const imageRes = await fetch(imageUrl, {
      headers: {
        // Spoof browser agar Shopee CDN mau serve
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://shopee.co.id/",
      },
    })

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageRes.status}` },
        { status: 400 }
      )
    }

    // 2. Baca sebagai ArrayBuffer → convert ke Buffer
    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 3. Deteksi content type
    const contentType = imageRes.headers.get("content-type") || "image/jpeg"
    const ext = contentType.includes("png") ? "png"
      : contentType.includes("webp") ? "webp"
      : "jpg"

    // 4. Upload ke Supabase Storage
    const supabase = await createClient()
    const fileName = `n8n-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    const filePath = `products/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // 5. Return public URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path)

    return NextResponse.json({ publicUrl })
  } catch (err: any) {
    console.error("[upload-image-from-url]", err)
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 })
  }
}