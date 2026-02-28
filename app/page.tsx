import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { CatalogHeader } from "@/components/catalog-header"
import { SiteFooter } from "@/components/site-footer"
import { CatalogFilters } from "@/components/catalog-filters"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"

const PAGE_SIZE = 20

async function getProducts(search?: string, category?: string, page = 1): Promise<Product[]> {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (category && category !== "Semua") query = query.eq("category", category)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error } = await query
  return error ? [] : (data as Product[])
}

async function countProducts(search?: string, category?: string): Promise<number> {
  const supabase = await createClient()
  let query = supabase.from("products").select("id", { count: "exact", head: true })

  if (category && category !== "Semua") query = query.eq("category", category)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { count, error } = await query
  return error ? 0 : count || 0
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q: search, category = "Semua" } = await searchParams
  const [products, total] = await Promise.all([getProducts(search, category), countProducts(search, category)])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CatalogHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <CatalogFilters currentCategory={category} />
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="text-foreground">{products.length}</span> dari <span className="text-foreground">{total}</span> produk
            {category !== "Semua" && <> di <span className="text-gold">{category}</span></>}
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse bg-white/5 rounded-2xl" />}>
          <ProductGrid products={products} total={total} search={search} category={category} />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  )
}