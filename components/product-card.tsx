import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-gold/40">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-navy text-primary-foreground border-0 text-xs">
          {product.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-semibold text-card-foreground leading-tight line-clamp-1 text-balance">
          {product.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>
        <p className="text-gold font-bold text-lg tracking-tight">
          {formatRupiah(product.price)}
        </p>

        <div className="flex gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-[#EE4D2D] text-[#ffffff] hover:bg-[#EE4D2D]/90 border-0 text-xs font-semibold"
          >
            <a
              href={product.shopee_url || "https://shopee.co.id"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-3.5" />
              Cek di Shopee
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 bg-navy text-primary-foreground hover:bg-navy-light border-0 text-xs font-semibold"
          >
            <a
              href={product.tiktok_url || "https://tiktok.com/shop"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-3.5" />
              Cek di TikTok
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}
