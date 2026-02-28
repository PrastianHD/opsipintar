"use client"

import Image from "next/image"
import { X, ExternalLink, Play, Star, ShoppingBag } from "lucide-react"
import { useEffect, useCallback } from "react"
import type { Product } from "@/lib/types"
import { sanitizeImageUrl } from "@/lib/image-url"

interface ExtendedProduct extends Product {
  is_trending?: boolean
  is_hemat?: boolean
  is_featured?: boolean
  video_url?: string | null
  review_url?: string | null
  tokopedia_url?: string | null
  lazada_url?: string | null
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface ProductModalProps {
  product: ExtendedProduct
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const videoUrl = product.video_url ?? null
  const reviewUrl = product.review_url ?? null
  const lainnyaUrl = product.tokopedia_url ?? product.lazada_url ?? null
  const imageUrl = sanitizeImageUrl(product.image_url)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — navy tint for brand cohesion */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className={[
        "relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl",
        "flex flex-col max-h-[92dvh] overflow-hidden",
        "animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300",
        "shadow-[0_24px_64px_rgba(0,31,91,0.3)]",
      ].join(" ")}>

        {/* Gold drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/40" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-8 flex items-center justify-center rounded-full bg-white/95 shadow-md text-foreground hover:text-navy transition-colors backdrop-blur-sm"
        >
          <X className="size-4" />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full shrink-0 bg-muted overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="size-12 text-border" />
            </div>
          )}

          {/* Badges — all navy/gold */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="rounded-full bg-navy/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 font-sans">
              {product.category}
            </span>
            {product.is_trending && (
              <span className="rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                🔥 Trending
              </span>
            )}
            {product.is_hemat && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold text-navy">
                💰 Opsi Hemat
              </span>
            )}
            {product.is_featured && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold text-navy">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy/30 to-transparent" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 flex flex-col gap-4">

            {/* Title + Price */}
            <div>
              {/* Montserrat heading */}
              <h2 className="font-heading text-base font-bold text-foreground leading-snug">
                {product.title}
              </h2>
              {/* Gold price */}
              <p className="font-heading text-xl font-black text-gold-dark mt-1">
                {formatRupiah(product.price)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              {/* Section label */}
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest">
                Beli Sekarang
              </p>

              <a href={product.shopee_url || "https://shopee.co.id"} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#EE4D2D] px-4 py-3.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(238,77,45,0.35)] hover:shadow-[0_6px_18px_rgba(238,77,45,0.45)] active:scale-[0.98] transition-all">
                <ExternalLink className="size-4" />Beli di Shopee
              </a>

              <a href={product.tiktok_url || "https://tiktok.com/shop"} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#010101] px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1a1a1a] active:scale-[0.98] transition-all">
                <ExternalLink className="size-4" />Beli di TikTok Shop
              </a>

              {lainnyaUrl && (
                <a href={lainnyaUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-gold/40 hover:bg-secondary active:scale-[0.98] transition-all">
                  <ExternalLink className="size-4" />Lainnya (Tokped / Lazada)
                </a>
              )}

              {(videoUrl || reviewUrl) && (
                <div className="flex gap-2 pt-1">
                  {videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold/30 bg-gold-muted px-3 py-2.5 text-xs font-semibold text-gold-dark hover:bg-gold/20 active:scale-[0.98] transition-all">
                      <Play className="size-3.5 fill-gold-dark text-gold-dark" />Cek Video Demo
                    </a>
                  )}
                  {reviewUrl && (
                    <a href={reviewUrl} target="_blank" rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-navy/20 bg-navy/5 px-3 py-2.5 text-xs font-semibold text-navy hover:bg-navy/10 active:scale-[0.98] transition-all">
                      <Star className="size-3.5 fill-navy text-navy" />Review Produk
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
