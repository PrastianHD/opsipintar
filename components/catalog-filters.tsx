"use client"

import { Search, X, SlidersHorizontal, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CATEGORIES, type Category } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useState, useEffect } from "react"

export function CatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const currentSearch = searchParams.get("q") || ""
  const currentCategory = (searchParams.get("category") || "Semua") as Category

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "Semua") params.set(key, value)
      else params.delete(key)
      startTransition(() => router.push(`?${params.toString()}`, { scroll: false }))
    },
    [router, searchParams]
  )

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    startTransition(() => router.push(`?${params.toString()}`, { scroll: false }))
  }, [router, searchParams])

  const selectCategory = (cat: string) => {
    updateParams("category", cat)
    setDrawerOpen(false)
  }

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  const activeCount = (currentCategory !== "Semua" ? 1 : 0) + (currentSearch ? 1 : 0)

  return (
    <>
      {/* ══ DESKTOP ══ */}
      <div className="hidden md:block sticky top-0 z-20 bg-white/96 backdrop-blur-sm border-b border-border pb-3 pt-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2.5">

          {/* Search */}
          <div className="relative max-w-md mx-auto w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Cari produk..."
              defaultValue={currentSearch}
              onChange={(e) => updateParams("q", e.target.value)}
              className="pl-9 pr-9 h-10 rounded-xl border-border focus-visible:border-gold focus-visible:ring-gold/20 text-sm font-sans"
            />
            {currentSearch && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none sm:flex-wrap sm:justify-center" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={currentCategory === cat}
                onClick={() => updateParams("category", cat)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap font-sans",
                  currentCategory === cat
                    ? "bg-navy text-white border-navy shadow-sm"
                    : "bg-white text-muted-foreground border-border hover:border-gold/60 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Brand gold progress bar on filter change */}
        {isPending && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-navy via-gold to-navy animate-pulse" />
        )}
      </div>

      {/* ══ MOBILE top bar ══ */}
      <div className="md:hidden sticky top-0 z-20 bg-white/96 backdrop-blur-sm border-b border-border px-3 py-2.5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari produk..."
            defaultValue={currentSearch}
            onChange={(e) => updateParams("q", e.target.value)}
            className="pl-9 pr-9 h-9 rounded-xl border-border text-sm focus-visible:border-gold focus-visible:ring-gold/20 font-sans"
          />
          {currentSearch && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter FAB — navy fill when active, gold ring on hover */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={cn(
            "relative shrink-0 flex items-center gap-1.5 rounded-xl border px-3 h-9 text-xs font-semibold transition-all font-sans",
            activeCount > 0
              ? "bg-navy text-white border-navy"
              : "bg-white text-muted-foreground border-border hover:border-gold/50"
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          Filter
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-gold text-navy text-[9px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {isPending && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-navy via-gold to-navy animate-pulse" />
        )}
      </div>

      {/* ══ MOBILE Filter Drawer ══ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-10 flex flex-col gap-5 animate-in slide-in-from-bottom duration-300 max-h-[80dvh] overflow-y-auto">
            {/* Gold drag handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-gold/40 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <h3 className="font-heading font-bold text-navy text-base">Filter Kategori</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-border transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const active = currentCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all text-left font-sans",
                      active
                        ? "bg-navy text-white border-navy shadow-sm"
                        : "bg-muted text-foreground border-border hover:border-gold/40 hover:bg-secondary"
                    )}
                  >
                    <span className="truncate">{cat}</span>
                    {active && <Check className="size-3.5 shrink-0 ml-2 text-gold" />}
                  </button>
                )
              })}
            </div>

            {/* Reset — uses gold border treatment */}
            {activeCount > 0 && (
              <button
                onClick={() => {
                  startTransition(() => router.push("?", { scroll: false }))
                  setDrawerOpen(false)
                }}
                className="w-full py-3 rounded-2xl border-2 border-gold/40 text-gold-dark text-sm font-semibold hover:bg-gold-muted transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
