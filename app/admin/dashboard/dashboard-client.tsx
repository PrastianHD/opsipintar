"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { sanitizeImageUrl } from "@/lib/image-url"
import type { Product } from "@/lib/types"
import {
  PlusCircle, Pencil, Trash2, Search, Package, AlertTriangle,
  MoreVertical, ExternalLink, ShoppingBag
} from "lucide-react"

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export function DashboardClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(product: Product) {
    setDeletingId(product.id)
    const supabase = createClient()

    // Delete image from storage if it's a Supabase storage URL
    if (product.image_url?.includes("supabase")) {
      const path = product.image_url.split("/storage/v1/object/public/")[1]
      if (path) await supabase.storage.from(path.split("/")[0]).remove([path.split("/").slice(1).join("/")])
    }

    const { error } = await supabase.from("products").delete().eq("id", product.id)

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== product.id))
    }

    setDeletingId(null)
    setConfirmDelete(null)
    router.refresh()
  }

  const stats = [
    { label: "Total Produk", value: products.length, color: "text-white" },
    { label: "Kategori Aktif", value: [...new Set(products.map(p => p.category))].length, color: "text-gold" },
    { label: "Produk Terbaru", value: products.slice(0,3).length > 0 ? formatDate(products[0]?.created_at) : "-", color: "text-white", small: true },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl text-navy">Dashboard Produk</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola semua produk di katalog Opsi Pintar.</p>
        </div>
        <Link
          href="/admin/add-product"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-bold font-heading shadow-sm hover:bg-navy-light active:scale-[0.98] transition-all"
        >
          <PlusCircle className="size-4" />
          Tambah Produk
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-navy rounded-2xl px-4 py-4 flex flex-col gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            <p className={`font-heading font-black ${s.small ? "text-base" : "text-2xl"} ${s.color} leading-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Cari produk atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border border-border">
          <div className="flex items-center justify-center size-16 rounded-full bg-muted">
            <Package className="size-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-foreground">Tidak ada produk</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? `Tidak ada hasil untuk "${search}"` : "Mulai tambah produk pertama Anda."}
            </p>
          </div>
          {!search && (
            <Link href="/admin/add-product" className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
              + Tambah Produk
            </Link>
          )}
        </div>
      )}

      {/* Product table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Produk</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Harga</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Ditambahkan</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => {
                  const imageUrl = sanitizeImageUrl(product.image_url)
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Product cell */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                            {imageUrl ? (
                              <Image src={imageUrl} alt={product.title} fill className="object-cover" sizes="44px" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="size-4 text-border" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-foreground text-sm line-clamp-1">{product.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:hidden">
                              {product.category} · {formatRupiah(product.price)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy/8 text-navy text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-heading font-bold text-gold-dark text-sm">{formatRupiah(product.price)}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-muted-foreground text-xs">{formatDate(product.created_at)}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Shopee link shortcut */}
                          {product.shopee_url && (
                            <a href={product.shopee_url} target="_blank" rel="noopener noreferrer"
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all opacity-0 group-hover:opacity-100">
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          <Link href={`/admin/edit-product/${product.id}`}
                            className="p-2 rounded-lg text-muted-foreground hover:text-navy hover:bg-navy/8 transition-all">
                            <Pencil className="size-3.5" />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(product)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{products.length}</span> produk
            </p>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center size-12 rounded-full bg-red-50 mx-auto mb-4">
              <AlertTriangle className="size-6 text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-center text-foreground text-base">Hapus Produk?</h3>
            <p className="text-sm text-center text-muted-foreground mt-2 mb-6">
              <span className="font-semibold text-foreground">"{confirmDelete.title}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {deletingId === confirmDelete.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menghapus...
                  </span>
                ) : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}