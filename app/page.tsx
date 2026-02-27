import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { CatalogHeader } from "@/components/catalog-header"
import { CatalogFilters } from "@/components/catalog-filters"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"

async function getProducts(
  search?: string,
  category?: string
): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (category && category !== "Semua") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error.message)
    return []
  }

  return data as Product[]
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const search = params.q || ""
  const category = params.category || "Semua"
  const products = await getProducts(search, category)

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-4">
                <div className="size-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <CatalogFilters />
          </Suspense>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {products.length}
              </span>{" "}
              produk
              {category !== "Semua" && (
                <>
                  {" "}
                  di{" "}
                  <span className="font-semibold text-gold">{category}</span>
                </>
              )}
              {search && (
                <>
                  {" "}
                  untuk{" "}
                  <span className="font-semibold text-foreground">
                    {'"'}
                    {search}
                    {'"'}
                  </span>
                </>
              )}
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Opsi Pintar &mdash; Rekomendasi produk pilihan terbaik untuk Anda.
          </p>
        </div>
      </footer>
    </div>
  )
}
