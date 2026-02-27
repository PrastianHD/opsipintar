import { Sparkles } from "lucide-react"

export function CatalogHeader() {
  return (
    <header className="bg-navy text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-10 rounded-lg bg-gold">
              <Sparkles className="size-5 text-navy" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance text-[#ffffff]">
              Opsi Pintar
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-[#c8d0e0] sm:text-base">
            Rekomendasi produk terbaik yang sudah dikurasi. Temukan pilihan
            cerdas untuk gaya hidup Anda.
          </p>
          <div className="mt-1 h-0.5 w-16 rounded-full bg-gold" />
        </div>
      </div>
    </header>
  )
}
