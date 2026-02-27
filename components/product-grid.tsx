import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { PackageSearch } from "lucide-react"

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex items-center justify-center size-16 rounded-full bg-muted">
          <PackageSearch className="size-7 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium text-lg">
            Produk tidak ditemukan
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Coba ubah kata kunci atau pilih kategori lain.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
