"use client"

import Image from "next/image"
import { X, ExternalLink, BookOpen, ShoppingBag } from "lucide-react"
import { useEffect, useCallback } from "react"
import type { Product } from "@/lib/types"
import { sanitizeImageUrl } from "@/lib/image-url"

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={[
        "relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl",
        "flex flex-col max-h-[92dvh] overflow-hidden",
        "animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300",
        "shadow-[0_24px_64px_rgba(0,31,91,0.3)]",
      ].join(" ")}>

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/40" />
        </div>

        {/* Close */}
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="rounded-full bg-navy/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 font-sans">
              {product.category}
            </span>
            {product.is_trending && (
              <span className="rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                🔥 Trending
              </span>
            )}
            {product.is_featured && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold text-navy">
                ⭐ Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy/30 to-transparent" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 flex flex-col gap-4">

            {/* Title + Price */}
            <div>
              <h2 className="font-heading text-base font-bold text-foreground leading-snug">
                {product.title}
              </h2>
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

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-1">
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

              {product.others_url && (
                <a href={product.others_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-gold/40 hover:bg-secondary active:scale-[0.98] transition-all">
                  <ExternalLink className="size-4" />Lainnya (Tokped / Lazada)
                </a>
              )}

              {product.review_url && (
                <a href={product.review_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gold-muted px-4 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold/20 active:scale-[0.98] transition-all">
                  <BookOpen className="size-4" />Cek Review / Video
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}