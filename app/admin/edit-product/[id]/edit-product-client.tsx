"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Product } from "@/lib/types"
import {
  ArrowLeft, Upload, Loader2, Save,
  ShoppingBag, Video, Link as LinkIcon,
  Star, Flame, Wand2, Check, AlertCircle,
  RefreshCw, ImageIcon
} from "lucide-react"
import Link from "next/link"

// ── n8n Edit-Image webhook URL ───────────────────────────────────────────────
const N8N_EDIT_IMAGE_URL = process.env.NEXT_PUBLIC_N8N_EDIT_IMAGE_URL
  || "https://n8n.opsipintar.site/webhook/edite-image"

type AIImageStatus = "idle" | "loading" | "success" | "error"

export default function EditProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title:       product.title,
    description: product.description,
    price:       product.price.toString(),
    category:    product.category,
    shopee_url:  product.shopee_url  || "",
    tiktok_url:  product.tiktok_url  || "",
    others_url:  product.others_url  || "",
    review_url:  product.review_url  || "",
    is_trending: product.is_trending || false,
    is_featured: product.is_featured || false,
  })

  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url)

  // AI image edit state
  const [aiStatus, setAiStatus]     = useState<AIImageStatus>("idle")
  const [aiError, setAiError]       = useState<string | null>(null)
  const [aiNewUrl, setAiNewUrl]     = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setAiNewUrl(null)
    }
  }

  // ── AI EDIT IMAGE ────────────────────────────────────────────────────────
  async function handleAIEditImage() {
    if (!product.id) return
    setAiStatus("loading")
    setAiError(null)

    try {
      const res = await fetch("/api/ai-edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Error ${res.status}`)
      }

      // Update preview dengan image baru dari Leonardo
      setAiNewUrl(data.new_image_url)
      setImagePreview(data.new_image_url)
      setImageFile(null) // clear manual upload

      // Update formData agar save juga pakai URL baru
      // (image_url di DB sudah diupdate oleh n8n, tapi kita tetap show preview)
      setAiStatus("success")
    } catch (err: any) {
      setAiError(err.message || "Gagal menghubungi AI. Coba lagi.")
      setAiStatus("error")
    }
  }

  // ── SAVE PRODUCT ─────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        let finalImageUrl = aiNewUrl || product.image_url

        if (imageFile) {
          const fileExt = imageFile.name.split(".").pop()
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(`products/${fileName}`, imageFile)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage
            .from("product-images").getPublicUrl(uploadData.path)
          finalImageUrl = publicUrl
        }

        const { error: updateError } = await supabase
          .from("products")
          .update({
            title:       formData.title,
            description: formData.description,
            price:       parseFloat(formData.price),
            category:    formData.category,
            image_url:   finalImageUrl,
            shopee_url:  formData.shopee_url  || null,
            tiktok_url:  formData.tiktok_url  || null,
            others_url:  formData.others_url  || null,
            review_url:  formData.review_url  || null,
            is_trending: formData.is_trending,
            is_featured: formData.is_featured,
          })
          .eq("id", product.id)

        if (updateError) throw updateError

        router.push("/admin/dashboard")
        router.refresh()
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan")
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard"
          className="flex items-center justify-center size-9 rounded-xl border border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-sm">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-heading font-black text-xl text-navy">Edit Produk</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Update detail produk Opsi Pintar</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT — info utama ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Info Produk */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Informasi Utama</h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Nama Produk *</label>
              <input type="text" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Harga (IDR) *</label>
                <input type="number" value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Kategori *</label>
                <input value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Deskripsi *</label>
              <textarea value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={5} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all resize-none" />
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Link Afiliasi & Review</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "shopee_url",  icon: ShoppingBag, label: "Shopee",        placeholder: "https://shope.ee/..." },
                { key: "tiktok_url",  icon: Video,       label: "TikTok Shop",   placeholder: "https://tiktok.com/..." },
                { key: "others_url",  icon: LinkIcon,    label: "Link Lainnya",  placeholder: "Tokopedia, dll." },
                { key: "review_url",  icon: Video,       label: "Review / Video", placeholder: "https://youtube.com/..." },
              ].map(({ key, icon: Icon, label, placeholder }) => (
                <div key={key}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    <Icon className="size-3.5" /> {label}
                  </label>
                  <input type="url" value={formData[key as keyof typeof formData] as string}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — image + badges + save ── */}
        <div className="space-y-5">

          {/* Image panel */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3 mb-4">Foto Produk</h2>

            {/* Image preview */}
            <div
              className="relative aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                  {/* Badge status image */}
                  {aiNewUrl && (
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Wand2 className="size-2.5" /> AI Edited
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <ImageIcon className="size-8 text-muted-foreground/40" />
                  <p className="text-xs font-medium text-muted-foreground">Klik untuk upload</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Manual upload button */}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full mt-3 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors">
              <Upload className="size-3.5" /> Upload manual
            </button>

            {/* ── AI EDIT IMAGE BUTTON ── */}
            <div className="mt-3 p-3 rounded-xl bg-navy/5 border border-navy/10">
              <p className="text-[10px] font-semibold text-navy/70 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Wand2 className="size-3" /> AI Image Enhancement
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                Leonardo AI akan download gambar produk, analisis kategori, lalu buat versi yang lebih profesional.
              </p>

              <button
                type="button"
                onClick={handleAIEditImage}
                disabled={aiStatus === "loading"}
                className={[
                  "w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                  aiStatus === "success"
                    ? "bg-emerald-500 text-white"
                    : aiStatus === "loading"
                      ? "bg-navy/20 text-navy/50 cursor-not-allowed"
                      : "bg-navy text-white hover:bg-navy-light active:scale-[0.97]"
                ].join(" ")}
              >
                {aiStatus === "loading" ? (
                  <><Loader2 className="size-3.5 animate-spin" /> Proses AI... (~1-2 menit)</>
                ) : aiStatus === "success" ? (
                  <><Check className="size-3.5" /> Gambar Diperbarui!</>
                ) : (
                  <><Wand2 className="size-3.5" /> Edit dengan Leonardo AI</>
                )}
              </button>

              {aiStatus === "loading" && (
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Sedang download → AI generate → upload ke Supabase...
                </p>
              )}
              {aiStatus === "error" && aiError && (
                <p className="mt-2 flex items-start gap-1.5 text-[10px] text-red-500">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5" /> {aiError}
                </p>
              )}
              {aiStatus === "success" && (
                <button type="button" onClick={() => { setAiStatus("idle"); setAiNewUrl(null); setImagePreview(product.image_url) }}
                  className="mt-2 w-full py-1.5 text-[10px] font-semibold text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-1">
                  <RefreshCw className="size-3" /> Revert ke gambar asli
                </button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Badge & Status</h2>
            {[
              { key: "is_trending", icon: Flame, iconClass: "text-orange-500", label: "Trending 🔥", desc: "Badge merah di card" },
              { key: "is_featured", icon: Star,  iconClass: "text-yellow-500", label: "Featured ⭐", desc: "Badge gold, card lebih besar" },
            ].map(({ key, icon: Icon, iconClass, label, desc }) => (
              <button type="button" key={key}
                onClick={() => setFormData({ ...formData, [key]: !formData[key as keyof typeof formData] })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                  formData[key as keyof typeof formData]
                    ? "bg-navy/5 border-navy/20"
                    : "bg-muted/30 border-transparent hover:border-border"
                }`}>
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${iconClass}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  formData[key as keyof typeof formData] ? "bg-navy border-navy" : "bg-white border-border"
                }`}>
                  {formData[key as keyof typeof formData] && <Check className="size-3 text-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* Save */}
          <button type="submit" disabled={isPending}
            className="w-full py-3.5 rounded-2xl font-heading font-bold text-sm tracking-wide bg-navy text-white hover:bg-navy-light shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {isPending
              ? <><Loader2 className="size-4 animate-spin" /> Menyimpan...</>
              : <><Save className="size-4" /> Simpan Perubahan</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}