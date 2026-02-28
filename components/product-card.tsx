"use client"

import Image from "next/image"
import { ShoppingCart, Flame, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types" // Import type asli lo
import { useState } from "react"
import { ProductModal } from "@/components/product-modal"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { sanitizeImageUrl } from "@/lib/image-url"


export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Ambil value dengan safe fallback sesuai property di lib/types.tsx
  const isFeatured = product.is_featured ?? false
  const isTrending = product.is_trending ?? false
  const imageUrl = sanitizeImageUrl(product.image_url)
  
  // Optimization: Image Priority buat baris atas (LCP Optimization)
  const isPriority = index < 4

  return (
    <>
      <Card 
        className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white rounded-2xl mb-4 break-inside-avoid"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
            {/* Badges Overlay */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {isTrending && (
                <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-[10px] py-0 px-2 gap-1 text-white uppercase font-bold">
                  <Flame className="w-3 h-3" /> Hot
                </Badge>
              )}
              {isFeatured && (
                <Badge className="bg-yellow-400 hover:bg-yellow-500 border-none text-slate-900 text-[10px] py-0 px-2 gap-1 font-bold uppercase">
                  <Star className="w-3 h-3 fill-current" /> Best
                </Badge>
              )}
            </div>

            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={isPriority}
              quality={85}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-3 gap-1">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            {product.category}
          </p>
          <h3 className="font-medium text-slate-900 line-clamp-2 text-sm h-10 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between w-full mt-1">
            <p className="font-bold text-indigo-600 text-base">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(product.price)}
            </p>
            <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
              <ShoppingCart className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Modal sinkron dengan state open/onOpenChange */}
      <ProductModal 
        product={product} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
}