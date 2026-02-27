"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CATEGORIES, type Category } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

export function CatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSearch = searchParams.get("q") || ""
  const currentCategory = (searchParams.get("category") || "Semua") as Category

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "Semua") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to no category filter when searching and vice versa
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }, [router, searchParams])

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative max-w-md mx-auto w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Cari produk..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("q", e.target.value)}
          className="pl-10 pr-10 h-11 bg-card border-border focus-visible:border-gold focus-visible:ring-gold/30 rounded-lg"
          aria-label="Cari produk"
        />
        {currentSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Hapus pencarian"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <nav
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Kategori produk"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={currentCategory === category}
            onClick={() => updateParams("category", category)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              currentCategory === category
                ? "bg-navy text-[#ffffff] border-navy shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-gold/50 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </nav>

      {isPending && (
        <div className="flex justify-center">
          <div className="size-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
