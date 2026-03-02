// app/api/ai-edit-image/route.ts
//
// Pipeline: Fetch product → AI generate prompt → Download image
//   → Leonardo init-image → Upload S3 → Generate v2 → Poll → Download hasil
//   → Upload Supabase → Update DB → return new_image_url

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY!
const OPENAI_API_KEY   = process.env.OPENAI_API_KEY!

// ── Leonardo Style IDs ────────────────────────────────────────────────────────
const STYLE = {
  "3d_render":          "debdf72a-91a4-467b-bf61-cc02bdeb69c6",
  "acrylic":            "3cbb655a-7ca4-463f-b697-8a03ad67327c",
  "creative":           "6fedbf1f-4a17-45ec-84fb-92fe524a29ef",
  "dynamic":            "111dc692-d470-4eec-b791-3475abac4c46",
  "fashion":            "594c4a08-a522-4e0e-b7ff-e4dac4b6b622",
  "game_concept":       "09d2b5b5-d7c5-4c02-905d-9f84051640f4",
  "graphic_2d":         "703d6fe5-7f1c-4a9e-8da0-5331f214d5cf",
  "graphic_3d":         "7d7c2bc5-4b12-4ac3-81a9-630057e9e89f",
  "illustration":       "645e4195-f63d-4715-a3f2-3fb1e6eb8c70",
  "none":               "556c1ee5-ec38-42e8-955a-1e82dad0ffa1",
  "portrait":           "8e2bc543-6ee2-45f9-bcd9-594b6ce84dcd",
  "portrait_cinematic": "4edb03c9-8a26-4041-9d01-f85b5d4abd71",
  "portrait_fashion":   "0d34f8e1-46d4-428f-8ddd-4b11811fa7c9",
  "pro_bw":             "22a9a7d2-2166-4d86-80ff-22e2643adbcf",
  "pro_color":          "7c3f932b-a572-47cb-9b9b-f20211e63b5b",
  "pro_film":           "581ba6d6-5aac-4492-bebe-54c424a0d46e",
  "ray_traced":         "b504f83c-3326-4947-82e1-7fe9e839ec0f",
  "stock_photo":        "5bdc3f2a-1be6-4d1c-8e77-992a30824a2c",
  "watercolor":         "1db308ce-c7ad-4d10-96fd-592fa6b75cc4",
} as const

// Pilih style berdasarkan kategori produk
function pickStyle(category: string): string {
  const cat = category.toLowerCase()
  if (cat.includes("gadget") || cat.includes("elektronik")) return STYLE.ray_traced
  if (cat.includes("skincare") || cat.includes("beauty") || cat.includes("kecantikan")) return STYLE.stock_photo
  if (cat.includes("fashion") || cat.includes("pakaian") || cat.includes("baju") || cat.includes("opsi fashion") || cat.includes("fashion cowok") || cat.includes("fashion cewek")) return STYLE.fashion
  if (cat.includes("makanan") || cat.includes("minuman") || cat.includes("food")) return STYLE.stock_photo
  if (cat.includes("rumah") || cat.includes("home") || cat.includes("living") || cat.includes("kebutuhan dapur")) return STYLE.stock_photo
  if (cat.includes("game") || cat.includes("mainan")) return STYLE.game_concept
  return STYLE.dynamic // default:
}


function pickDimensions(category: string): { width: number; height: number } {
  return { width: 1024, height: 1024 } 
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Generate prompt via OpenAI
// Tambahkan parameter imageUrl
async function generatePrompt(title: string, category: string, imageUrl: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano", 
      temperature: 0.5,
      max_tokens: 1500, 
      messages: [
        {
          role: "system",
          content: `You are an expert prompt engineer for Leonardo AI Image-to-Image.
Write a SHORT English prompt to replace the background of a product photo. The core product MUST remain 100% identical. Max 60 words.
Start with: "Flawless retouching, exactly preserve original product structure,"
To achieve a premium and aesthetic e-commerce look, use this background style: "soft pastel gradient background, elegant minimalist environment, soft studio lighting, subtle smooth surface reflection, gentle shadows, premium catalog style, isolated product, aesthetic color tone, avoid pure white".
Always end with: "commercial product photo, 4k resolution, highly detailed, empty background, no text, no watermark."
Output ONLY the prompt text.`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Product: ${title}\nCategory: ${category}\nLook at this image. Briefly describe the core product's shape/color in the prompt so it is preserved, then apply the background instructions.` 
            },
            { 
              type: "image_url", 
              image_url: { url: imageUrl } // Ini kuncinya! Kita kirim URL fotonya.
            }
          ]
        }
      ]
    })
  })

  if (!res.ok) {
    const errText = await res.text();
    console.error("[generatePrompt] OpenAI Error:", errText);
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json()
  // Tambahin console.log buat nge-debug kalau AI jawabnya aneh
  console.log("[generatePrompt] Raw response:", data.choices?.[0]?.message?.content);
  
  const prompt = data.choices?.[0]?.message?.content?.trim() ?? ""

  if (!prompt) {
    return `Flawless retouching, exactly preserve original product structure, ${title} product photography, soft pastel gradient background, elegant minimalist environment, soft studio lighting, subtle smooth surface reflection, gentle shadows, premium catalog style, isolated product, aesthetic color tone, avoid pure white, commercial product photo, 4k resolution, highly detailed, no text, no watermark`
  }
  return prompt
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Download image ke Buffer
// ─────────────────────────────────────────────────────────────────────────────
async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://opsipintar.site" }
  })
  if (!res.ok) throw new Error(`Download image failed ${res.status}: ${url}`)
  const contentType = res.headers.get("content-type") || "image/jpeg"
  return { buffer: Buffer.from(await res.arrayBuffer()), contentType }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Leonardo init-image → dapat presigned URL
async function leonardoInitImage(extension: "jpg" | "png" | "webp"): Promise<{
  image_id: string
  upload_url: string
  fields: Record<string, string>
}> {
  const res = await fetch("https://cloud.leonardo.ai/api/rest/v1/init-image", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": `Bearer ${LEONARDO_API_KEY}`,
    },
    body: JSON.stringify({ extension })
  })

  if (!res.ok) throw new Error(`Leonardo init-image error ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const init = data.uploadInitImage

  return {
    image_id:   init.id,
    upload_url: init.url,
    fields:     JSON.parse(init.fields) as Record<string, string>,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4: Upload ke S3 via presigned URL
async function leonardoUploadS3(
  uploadUrl: string,
  fields: Record<string, string>,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const form = new FormData()

  // fields dari Leonardo harus dimasukkan dulu (urutan penting untuk S3)
  for (const [key, val] of Object.entries(fields)) {
    form.append(key, val)
  }

  // File harus paling terakhir
  form.append("file", new Blob([buffer], { type: contentType }), "product.jpg")

  // Tidak perlu Authorization header — S3 pakai Policy dari fields
  const res = await fetch(uploadUrl, { method: "POST", body: form })

  // S3 return 204 saat sukses
  if (res.status !== 204 && res.status !== 200 && res.status !== 201) {
    throw new Error(`S3 upload failed ${res.status}: ${await res.text()}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5: Generate image — pakai v2/generations dengan image_reference
async function leonardoGenerate(
  imageId: string,
  prompt: string,
  styleId: string,
  width: number,
  height: number
): Promise<string> {
  const res = await fetch("https://cloud.leonardo.ai/api/rest/v2/generations", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": `Bearer ${LEONARDO_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash-image",
      parameters: {
        width,
        height,
        prompt,
        quantity: 1,
        guidances: {
          image_reference: [
            {
              image: {
                id:   imageId,
                type: "UPLOADED"
              },
              strength: "MID"
            }
          ]
        },
        style_ids:      [styleId],
        prompt_enhance: "OFF"
      },
      public: false
    })
  })

  const responseText = await res.text()
  console.log(`[ai-edit] generate status:${res.status} body:`, responseText.slice(0, 500))
  if (!res.ok) throw new Error(`Leonardo generate error ${res.status}: ${responseText}`)

  const data = JSON.parse(responseText)
  const generationId = data.generate?.generationId
  if (!generationId) throw new Error(`No generationId. Full response: ${responseText}`)
  return generationId
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6: Poll status GET /v1/generations/:id
async function leonardoPoll(generationId: string): Promise<string> {
  const MAX_POLLS = 10
  const WAIT_MS   = 30_000 // 30 detik per poll sesuai docs

  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(WAIT_MS)

    const res = await fetch(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${LEONARDO_API_KEY}`,
        }
      }
    )

    if (!res.ok) {
      console.warn(`[poll] HTTP ${res.status}, retry ${i + 1}/${MAX_POLLS}`)
      continue
    }

    const data = await res.json()
    const gen  = data.generations_by_pk
    const status = gen?.status

    console.log(`[poll] ${i + 1}/${MAX_POLLS} → ${status}`)

    if (status === "COMPLETE") {
      const images = gen?.generated_images
      if (!images?.length) throw new Error("COMPLETE tapi tidak ada gambar")
      return images[0].url
    }

    if (status === "FAILED") throw new Error("Leonardo generation FAILED")
    // PENDING / PROCESSING → lanjut poll
  }

  throw new Error(`Timeout setelah ${MAX_POLLS * 30} detik`)
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7: Upload hasil ke Supabase Storage
// ─────────────────────────────────────────────────────────────────────────────
async function uploadResultToSupabase(
  buffer: Buffer,
  contentType: string,
  productId: string
): Promise<string> {
  const ext        = contentType.includes("png") ? "png" : "jpg"
  const filename   = `edited-${productId}-${Date.now()}.${ext}`
  const path       = `products/${filename}`
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/product-images/${path}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "apikey":         serviceKey,
        "Content-Type":   contentType,
        "x-upsert":       "true",
      },
      body: buffer
    }
  )

  if (!res.ok) throw new Error(`Supabase storage upload failed: ${await res.text()}`)

  return `${supabaseUrl}/storage/v1/object/public/product-images/${path}`
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { product_id } = await req.json()
    if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 })
    if (!LEONARDO_API_KEY) return NextResponse.json({ error: "LEONARDO_API_KEY not set" }, { status: 500 })
    if (!OPENAI_API_KEY)   return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 })

    // 1. Fetch product
    const supabase = await createClient()
    const { data: product, error } = await supabase
      .from("products")
      .select("id, title, category, image_url")
      .eq("id", product_id)
      .single()

    if (error || !product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    if (!product.image_url) return NextResponse.json({ error: "Product has no image" }, { status: 400 })

    const styleId          = pickStyle(product.category)
    const { width, height } = pickDimensions(product.category)
    console.log(`[ai-edit] "${product.title}" | style: ${styleId} | ${width}×${height}`)

    // 2. Generate prompt
    const prompt = await generatePrompt(product.title, product.category, product.image_url)
    console.log(`[ai-edit] prompt: ${prompt}`)

    // 3. Download image produk
    const { buffer: imgBuffer, contentType: imgType } = await downloadImage(product.image_url)
    console.log(`[ai-edit] downloaded: ${imgBuffer.length} bytes`)

    // 4. Leonardo init-image
    const ext = imgType.includes("png") ? "png" : imgType.includes("webp") ? "webp" : "jpg"
    const { image_id, upload_url, fields } = await leonardoInitImage(ext as "jpg" | "png" | "webp")
    console.log(`[ai-edit] leonardo image_id: ${image_id}`)

    // 5. Upload ke S3
    await leonardoUploadS3(upload_url, fields, imgBuffer, imgType)
    console.log(`[ai-edit] uploaded to S3`)

    // 6. Generate
    const generationId = await leonardoGenerate(image_id, prompt, styleId, width, height)
    console.log(`[ai-edit] generation started: ${generationId}`)

    // 7. Poll sampai COMPLETE
    const resultUrl = await leonardoPoll(generationId)
    console.log(`[ai-edit] generation complete: ${resultUrl}`)

    // 8. Download hasil
    const { buffer: resultBuffer, contentType: resultType } = await downloadImage(resultUrl)

    // 9. Upload ke Supabase Storage
    const newImageUrl = await uploadResultToSupabase(resultBuffer, resultType, product_id)
    console.log(`[ai-edit] saved to supabase: ${newImageUrl}`)

    // 10. Update DB
    const { error: updateErr } = await supabase
      .from("products")
      .update({ image_url: newImageUrl })
      .eq("id", product_id)

    if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`)
    console.log(`[ai-edit] DB updated ✓`)

    return NextResponse.json({ success: true, product_id, new_image_url: newImageUrl })

  } catch (err: any) {
    console.error("[ai-edit-image] ERROR:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}