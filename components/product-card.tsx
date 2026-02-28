"use client"

import Image from "next/image"
import { ExternalLink, Eye, ShoppingBag, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { useState, useCallback } from "react"
import { ProductModal } from "@/components/product-modal"
import { sanitizeImageUrl } from "@/lib/image-url"

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const isFeatured = product.is_featured ?? false
  const isTrending = product.is_trending ?? false
  const imageUrl = sanitizeImageUrl(product.image_url)
  const aspectClass = isFeatured ? "aspect-[3/4]" : "aspect-square"

  const openModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setModalOpen(true)
  }, [])

  return (
    <>
      {/* ── Card ── */}
      <article
        className={[
          "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
          "shadow-[0_2px_8px_rgba(0,31,91,0.06)] hover:shadow-[0_8px_28px_rgba(0,31,91,0.14)]",
          "transition-all duration-300 ease-out hover:-translate-y-0.5",
          "break-inside-avoid mb-3",
        ].join(" ")}
      >
        {/* ── Image ── */}
        <div className={`relative ${aspectClass} overflow-hidden bg-muted cursor-pointer`} onClick={openModal}>
          {!imgLoaded && <div className="absolute inset-0 animate-shimmer" />}

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
              className={[
                "object-cover transition-all duration-500 group-hover:scale-[1.04]",
                imgLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
              onLoad={() => setImgLoaded(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <ShoppingBag className="size-8 text-border" />
            </div>
          )}

          {/* Gradient + Quick View */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            onClick={openModal}
            className={[
              "absolute bottom-2 left-1/2 -translate-x-1/2",
              "flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm",
              "px-3.5 py-1.5 text-[11px] font-semibold text-navy shadow-lg whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
              "transition-all duration-300 ease-out",
            ].join(" ")}
          >
            <Eye className="size-3" />
            Quick View
          </button>

          {/* Category badge */}
          <Badge className="absolute top-2 left-2 bg-navy/90 text-white border-0 text-[10px] px-2 py-0.5 backdrop-blur-sm font-sans">
            {product.category}
          </Badge>

          {/* Status badge */}
          {isTrending && (
            <span className="absolute top-2 right-2 rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold text-gold shadow">
              🔥 Trending
            </span>
          )}
          {isFeatured && !isTrending && (
            <span className="absolute top-2 right-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-navy shadow">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col gap-2 p-3">
          <h3
            className="font-heading font-semibold text-foreground text-xs leading-snug line-clamp-2 cursor-pointer hover:text-navy transition-colors"
            onClick={openModal}
          >
            {product.title}
          </h3>

          <p className="text-gold-dark font-bold text-sm font-heading">
            {formatRupiah(product.price)}
          </p>

          {/* Buy CTAs */}
          <div className="flex flex-col gap-1.5">
            <a
              href={product.shopee_url || "https://shopee.co.id"}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#EE4D2D] px-3 py-2 text-[11px] font-bold text-white transition-all active:scale-95 hover:brightness-110 shadow-sm"
            >
              <ExternalLink className="size-3 shrink-0" />
              Beli di Shopee
            </a>
            <a
              href={product.tiktok_url || "https://tiktok.com/shop"}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#010101] px-3 py-2 text-[11px] font-bold text-white transition-all active:scale-95 hover:bg-[#1a1a1a] shadow-sm"
            >
              <ExternalLink className="size-3 shrink-0" />
              Beli di TikTok Shop
            </a>
            {product.others_url && (
              <a
                href={product.others_url}
                target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-2 text-[11px] font-semibold text-muted-foreground transition-all active:scale-95 hover:bg-secondary hover:border-gold/40"
              >
                <ExternalLink className="size-3 shrink-0" />
                Lainnya
              </a>
            )}
          </div>

          {/* Review / Video link */}
          {product.review_url && (
            <a
              href={product.review_url}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/30 bg-gold-muted px-3 py-2 text-[11px] font-semibold text-gold-dark transition-colors hover:bg-gold/20 active:scale-95"
            >
              <BookOpen className="size-3 shrink-0" />
              Cek Review / Video
            </a>
          )}
        </div>

        {/* Mobile tap overlay */}
        <button
          className="absolute inset-0 md:hidden"
          aria-label="Lihat opsi beli"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a, button:not([aria-label='Lihat opsi beli'])")) return
            setBottomSheetOpen(true)
          }}
        />
      </article>

      {/* ── Mobile Bottom Sheet ── */}
      {bottomSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setBottomSheetOpen(false)} />
          <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto w-10 h-1 rounded-full bg-gold/40" />
            <div className="flex gap-3 items-start">
              {imageUrl && (
                <div className="relative size-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                  <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-xs font-heading font-semibold text-foreground line-clamp-2">{product.title}</p>
                <p className="text-sm font-bold text-gold-dark mt-1 font-heading">{formatRupiah(product.price)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={product.shopee_url || "https://shopee.co.id"} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#EE4D2D] px-4 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform">
                <ExternalLink className="size-4" />Beli di Shopee
              </a>
              <a href={product.tiktok_url || "https://tiktok.com/shop"} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#010101] px-4 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform">
                <ExternalLink className="size-4" />Beli di TikTok Shop
              </a>
              {product.others_url && (
                <a href={product.others_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-gold/40 active:scale-[0.98] transition-all">
                  <ExternalLink className="size-4" />Lainnya (Tokped / Lazada)
                </a>
              )}
              {product.review_url && (
                <a href={product.review_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gold-muted px-4 py-2.5 text-sm font-semibold text-gold-dark active:scale-[0.98] transition-transform">
                  <BookOpen className="size-4" />Cek Review / Video
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  )
}