import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { CatalogHeader } from "@/components/catalog-header"
import { CatalogFilters } from "@/components/catalog-filters"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"

const PAGE_SIZE = 20

async function getProducts(
  search?: string,
  category?: string,
  page = 1
): Promise<Product[]> {
  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (category && category !== "Semua") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error.message)
    return []
  }

  return data as Product[]
}

// Count helper for the label
async function countProducts(
  search?: string,
  category?: string
): Promise<number> {
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select("id", { count: "exact", head: true })

  if (category && category !== "Semua") {
    query = query.eq("category", category)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { count } = await query
  return count ?? 0
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const search = params.q || ""
  const category = params.category || "Semua"

  const [products, total] = await Promise.all([
    getProducts(search, category, 1),
    countProducts(search, category),
  ])

  return (
    /*
      ── Layout notes ──────────────────────────────────────────────────────────
      • min-h-dvh instead of min-h-screen → respects mobile browser chrome
      • NO overflow-hidden on root → lets sticky children (header, filters) work
      • CatalogHeader is sticky top-0 z-30 (inside the component)
      • CatalogFilters is sticky top-[header-height] z-20 (inside the component)
        The header shrinks to ~48px on scroll; filters use `top-[48px]` fallback.
        Both are self-contained — no wrapper needed here.
    */
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Sticky shrink-on-scroll header — manages its own `sticky top-0 z-30` */}
      <CatalogHeader />

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pb-12">
        {/* Filters — manage their own sticky positioning */}
        <Suspense
          fallback={
            <div className="h-13 flex items-center justify-center">
              <div className="size-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <CatalogFilters />
        </Suspense>

        {/* Result count label */}
        <div className="flex items-center justify-between py-3 px-1">
          <p className="text-xs text-muted-foreground">
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {products.length}
            </span>
            {total > products.length && (
              <>
                {" "}dari{" "}
                <span className="font-semibold text-foreground">{total}</span>
              </>
            )}{" "}
            produk
            {category !== "Semua" && (
              <>
                {" "}di kategori{" "}
                <span className="font-semibold text-gold">{category}</span>
              </>
            )}
            {search && (
              <>
                {" "}untuk{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{search}&rdquo;
                </span>
              </>
            )}
          </p>
        </div>

        {/*
          ProductGrid handles its own infinite scroll via IntersectionObserver.
          The `fetchMore` prop is a client-side async function — but since page.tsx
          is a Server Component we can't pass a closure directly.

          Two options:
          A) Pass `total` and let a Client wrapper handle fetchMore via a
             Server Action / Route Handler. ← cleanest for RSC architecture
          B) Render all products server-side (no infinite scroll) and rely on
             the grid's built-in loadMore if you convert ProductGrid to RSC-aware.

          For now we pass the initial batch. If you want client-side infinite
          scroll, create `app/api/products/route.ts` (see below) and pass the
          URL as a prop to ProductGrid, which then fetches internally.
          The ProductGrid component is already wired up — just pass `fetchMore`.
        */}
        <ProductGrid
          products={products}
          total={total}
          search={search}
          category={category}
        />
      </main>

    </div>
  )
}