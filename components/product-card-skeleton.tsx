// components/product-card-skeleton.tsx

interface ProductCardSkeletonProps {
  tall?: boolean
}

export function ProductCardSkeleton({ tall = false }: ProductCardSkeletonProps) {
  return (
    <div className="break-inside-avoid mb-3 rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Image skeleton */}
      <div
        className={[
          "w-full animate-shimmer",
          tall ? "aspect-[3/4]" : "aspect-square",
        ].join(" ")}
      />
      {/* Content skeleton — navy-tinted pulses */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-4/5 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-3/5 rounded-full bg-muted animate-pulse" />
        {/* Price — gold-tinted */}
        <div className="h-4 w-2/5 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(197,160,89,0.18)' }} />
        <div className="flex flex-col gap-1.5 mt-1">
          {/* Shopee button */}
          <div className="h-8 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(238,77,45,0.12)' }} />
          {/* TikTok button */}
          <div className="h-8 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}
