"use client"

import { useEffect, useRef, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import type { Product } from "@/lib/types"
import { PackageSearch } from "lucide-react"

const PAGE_SIZE = 20

interface ProductGridProps {
  products: Product[]
  total?: number
  search?: string
  category?: string
}

export function ProductGrid({
  products: initialProducts,
  total = 0,
  search = "",
  category = "Semua",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length < total)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // ✅ FIX: track in-flight fetch with a ref so observer never fires twice
  const loadingRef = useRef(false)

  // Reset on filter/search change
  useEffect(() => {
    setProducts(initialProducts)
    setPage(1)
    setHasMore(initialProducts.length < total)
    loadingRef.current = false
  }, [initialProducts, total])

  // ✅ FIX: useEffect deps are stable refs/primitives only.
  // The old version had `loadMore` (a new function each render) in deps,
  // which caused the observer to disconnect + reconnect on every render,
  // sometimes firing immediately and triggering a fetch mid-scroll.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return
        if (loadingRef.current) return

        // Read latest hasMore from DOM attribute to avoid stale closure
        const stillHasMore = sentinel.dataset.hasMore === "true"
        if (!stillHasMore) return

        loadingRef.current = true
        setLoading(true)

        try {
          // Read current page from data attribute — avoids stale closure on `page`
          const currentPage = Number(sentinel.dataset.page ?? "1")
          const nextPage = currentPage + 1

          const params = new URLSearchParams({
            page: String(nextPage),
            ...(search && { q: search }),
            ...(category && category !== "Semua" && { category }),
          })

          const res = await fetch(`/api/products?${params.toString()}`)
          if (!res.ok) throw new Error("fetch failed")
          const more: Product[] = await res.json()

          setProducts((prev) => [...prev, ...more])
          setPage(nextPage)
          if (more.length < PAGE_SIZE) setHasMore(false)
        } catch (err) {
          console.error("Infinite scroll fetch error:", err)
        } finally {
          loadingRef.current = false
          setLoading(false)
        }
      },
      // ✅ Smaller rootMargin — 300px was firing before user even got close
      { rootMargin: "100px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
    // ✅ Only re-attach when search/category changes (new query context)
    // page and hasMore are read via data attributes, not closure
  }, [search, category])

  if (products.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-center justify-center size-16 rounded-full bg-gray-100">
          <PackageSearch className="size-7 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-base">Produk tidak ditemukan</p>
          <p className="text-gray-500 text-sm mt-1">Coba ubah kata kunci atau pilih kategori lain.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="columns-2 gap-2.5 sm:columns-3 lg:columns-4 xl:columns-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`skel-${i}`} tall={i % 3 === 0} />
          ))}
      </div>

      {/* Sentinel — carries page + hasMore as data attrs to avoid stale closures */}
      <div
        ref={sentinelRef}
        data-page={page}
        data-has-more={hasMore}
        className="h-2 w-full"
        aria-hidden
      />

      {!hasMore && products.length > 0 && !loading && (
        <p className="text-center text-xs text-muted-foreground py-10 tracking-wide">
          — Semua produk sudah ditampilkan —
        </p>
      )}
    </div>
  )
}