"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { CATEGORIES } from "@/lib/types"
import {
  Upload, ArrowLeft, Check, AlertCircle,
  Wand2, Loader2, Save, Link as LinkIcon, X
} from "lucide-react"

// ── Ganti dengan n8n webhook URL kamu ──────────────────────────────────────────
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n.opsipintar.site/webhook/product-scraper"

type AutoFillStatus = "idle" | "loading" | "success" | "error"
type SaveStatus = "idle" | "uploading" | "saving" | "done" | "error"

export default function AddProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Auto-fill state
  const [shopeeInputUrl, setShopeeInputUrl] = useState("")
  const [autoFillStatus, setAutoFillStatus] = useState<AutoFillStatus>("idle")
  const [autoFillError, setAutoFillError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Opsi Viral",
    shopee_url: "",
    tiktok_url: "",
    others_url: "",
    review_url: "",
    is_trending: false,
    is_featured: false,
  })

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null)

  // Save state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  function update(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ── Mapping kategori n8n → CATEGORIES website ─────────────────────────────
  function mapCategory(raw?: string): string {
    if (!raw) return "Opsi Viral"
    const lower = raw.toLowerCase()
    if (lower.includes("gadget") || lower.includes("elektronik")) return "Opsi Gadget"
    if (lower.includes("fashion") || lower.includes("pakaian")) return "Opsi Fashion"
    if (lower.includes("rumah") || lower.includes("home") || lower.includes("living")) return "Opsi Rumah"
    return "Opsi Lainnya"
  }

  // ── AUTO FILL dari URL Shopee ─────────────────────────────────────────────
  async function handleAutoFill() {
    if (!shopeeInputUrl.trim()) return
    setAutoFillStatus("loading")
    setAutoFillError(null)

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shopeeInputUrl.trim() }),
      })

      if (!res.ok) throw new Error(`n8n responded with status ${res.status}`)

      const raw = await res.json()
      // n8n bisa return string JSON atau object langsung
      const data = typeof raw === "string"
        ? JSON.parse(raw)
        : raw.response
          ? (typeof raw.response === "string" ? JSON.parse(raw.response) : raw.response)
          : raw

      setForm(prev => ({
        ...prev,
        title:       data.name        || prev.title,
        description: data.description || prev.description,
        price:       data.price       ? String(data.price) : prev.price,
        category:    mapCategory(data.category),
        shopee_url:  shopeeInputUrl.trim(),
      }))

      if (data.imageUrl) {
        setImageSourceUrl(data.imageUrl)
        setImagePreview(data.imageUrl)
        setImageFile(null)
      }

      setAutoFillStatus("success")
    } catch (err: any) {
      setAutoFillError(err.message || "Gagal. Pastikan URL valid dan n8n aktif.")
      setAutoFillStatus("error")
    }
  }

  // ── UPLOAD FILE MANUAL ────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageSourceUrl(null)
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    setImageSourceUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── SAVE PRODUCT ──────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaveStatus("uploading")
    setSaveError(null)

    try {
      let finalImageUrl: string | null = null

      if (imageFile) {
        // Upload file manual
        const ext = imageFile.name.split(".").pop()
        const path = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
        const { data: up, error: upErr } = await supabase.storage
          .from("product-images").upload(path, imageFile)
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage
          .from("product-images").getPublicUrl(up.path)
        finalImageUrl = publicUrl

      } else if (imageSourceUrl) {
        // Proxy download Shopee image → upload ke Supabase via API route
        const res = await fetch("/api/upload-image-from-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: imageSourceUrl }),
        })
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Gagal upload gambar dari Shopee")
        finalImageUrl = result.publicUrl
      }

      setSaveStatus("saving")

      const { error: insertErr } = await supabase.from("products").insert({
        title:       form.title,
        description: form.description,
        price:       parseFloat(form.price),
        category:    form.category,
        image_url:   finalImageUrl,
        shopee_url:  form.shopee_url  || null,
        tiktok_url:  form.tiktok_url  || null,
        others_url:  form.others_url  || null,
        review_url:  form.review_url  || null,
        is_trending: form.is_trending,
        is_featured: form.is_featured,
      })

      if (insertErr) throw insertErr

      setSaveStatus("done")
      setTimeout(() => { router.push("/admin/dashboard"); router.refresh() }, 800)

    } catch (err: any) {
      setSaveError(err.message || "Terjadi kesalahan")
      setSaveStatus("error")
    }
  }

  const isSaving = saveStatus === "uploading" || saveStatus === "saving"
  const isDone   = saveStatus === "done"

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard"
          className="flex items-center justify-center size-9 rounded-xl border border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-sm">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-heading font-black text-xl text-navy">Tambah Produk</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Isi manual atau auto-fill dari URL Shopee</p>
        </div>
      </div>

      {/* ── AUTO-FILL PANEL ── */}
      <div className="mb-6 p-5 rounded-2xl bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="size-4 text-gold" />
            <p className="font-heading font-bold text-sm">Auto-fill dari URL Shopee</p>
          </div>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Paste link produk → AI otomatis isi judul, harga, deskripsi, kategori, dan foto ke Supabase.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="url"
                value={shopeeInputUrl}
                onChange={e => setShopeeInputUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAutoFill())}
                placeholder="https://shopee.co.id/... atau shope.ee/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 border border-white/10 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
              />
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={autoFillStatus === "loading" || !shopeeInputUrl.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy text-sm font-bold hover:bg-gold-light active:scale-[0.97] transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {autoFillStatus === "loading"
                ? <><Loader2 className="size-4 animate-spin" /> Memproses...</>
                : <><Wand2 className="size-4" /> Auto Fill</>
              }
            </button>
          </div>
          {autoFillStatus === "success" && (
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Check className="size-4" /> Berhasil! Form sudah diisi — periksa dan lengkapi jika perlu.
            </p>
          )}
          {autoFillStatus === "error" && autoFillError && (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-red-300">
              <AlertCircle className="size-4 shrink-0 mt-0.5" /> {autoFillError}
            </p>
          )}
        </div>
      </div>

      {/* ── FORM ── */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Kiri — fields utama */}
          <div className="lg:col-span-2 space-y-5">

            {/* Info Produk */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Informasi Produk</h2>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Nama Produk *</label>
                <input type="text" value={form.title} onChange={e => update("title", e.target.value)}
                  placeholder="Nama produk tanpa spam SEO..." required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Harga (IDR) *</label>
                  <input type="number" value={form.price} onChange={e => update("price", e.target.value)}
                    placeholder="150000" required min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Kategori *</label>
                  <select value={form.category} onChange={e => update("category", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all">
                    {CATEGORIES.filter(c => c !== "Semua").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Deskripsi *</label>
                <textarea value={form.description} onChange={e => update("description", e.target.value)}
                  placeholder="Deskripsi singkat dan menarik..." required rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all resize-none" />
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Link Marketplace & Review</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "shopee_url",  label: "Shopee URL",          placeholder: "https://shope.ee/..." },
                  { key: "tiktok_url",  label: "TikTok Shop URL",     placeholder: "https://tiktok.com/..." },
                  { key: "others_url",  label: "Lainnya (Tokped dll)", placeholder: "https://..." },
                  { key: "review_url",  label: "Review / Video URL",  placeholder: "https://youtube.com/..." },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
                    <input type="url" value={form[key as keyof typeof form] as string}
                      onChange={e => update(key, e.target.value)} placeholder={placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kanan — image + badges + submit */}
          <div className="space-y-5">

            {/* Image */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3 mb-4">Foto Produk</h2>
              <div
                className="relative aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image src={imagePreview} alt="Preview" fill className="object-cover"
                      unoptimized={!!imageSourceUrl} />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${imageSourceUrl ? "bg-gold text-navy" : "bg-navy text-white"}`}>
                        {imageSourceUrl ? "dari Shopee ✓" : "Upload"}
                      </span>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); clearImage() }}
                      className="absolute top-2 right-2 size-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all">
                      <X className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <Upload className="size-8 text-muted-foreground/40" />
                    <p className="text-xs font-medium text-muted-foreground">Klik untuk upload</p>
                    <p className="text-[10px] text-muted-foreground/60">atau auto-fill dari URL di atas</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              {imagePreview && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-3 py-2 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors">
                  Ganti foto manual
                </button>
              )}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
              <h2 className="font-heading font-bold text-sm text-navy border-b border-border pb-3">Badge</h2>
              {[
                { key: "is_trending", label: "🔥 Trending", desc: "Badge merah di card" },
                { key: "is_featured", label: "⭐ Featured",  desc: "Badge gold, card lebih besar" },
              ].map(({ key, label, desc }) => (
                <button type="button" key={key}
                  onClick={() => update(key, !(form[key as keyof typeof form] as boolean))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    form[key as keyof typeof form]
                      ? "bg-navy/5 border-navy/20"
                      : "bg-muted/30 border-transparent hover:border-border"
                  }`}>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    form[key as keyof typeof form] ? "bg-navy border-navy" : "bg-white border-border"
                  }`}>
                    {form[key as keyof typeof form] && <Check className="size-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSaving || isDone}
              className={`w-full py-3.5 rounded-2xl font-heading font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                isDone ? "bg-emerald-500 text-white"
                  : "bg-navy text-white hover:bg-navy-light shadow-md active:scale-[0.98]"
              } ${isSaving || isDone ? "opacity-90 cursor-not-allowed" : ""}`}>
              {isDone ? (
                <><Check className="size-4" /> Tersimpan!</>
              ) : isSaving ? (
                <><Loader2 className="size-4 animate-spin" />
                  {saveStatus === "uploading" ? "Upload gambar..." : "Menyimpan..."}</>
              ) : (
                <><Save className="size-4" /> Simpan Produk</>
              )}
            </button>

            {saveError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                <AlertCircle className="size-4 shrink-0 mt-0.5" /> {saveError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}