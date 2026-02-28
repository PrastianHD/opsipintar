"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Product } from "@/lib/types"
import { ArrowLeft, Upload, Loader2, Save, ShoppingBag, Video, Link as LinkIcon, Star, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Link from "next/link"

export default function EditProductClient({ product }: { product: Product }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    shopee_url: product.shopee_url || "",
    tiktok_url: product.tiktok_url || "",
    others_url: product.others_url || "",
    review_url: product.review_url || "",
    is_trending: product.is_trending || false,
    is_featured: product.is_featured || false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        let finalImageUrl = product.image_url

        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(`products/${fileName}`, imageFile)
          
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(uploadData.path)
          finalImageUrl = publicUrl
        }

        const { error: updateError } = await supabase.from('products').update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: finalImageUrl,
          shopee_url: formData.shopee_url || null,
          tiktok_url: formData.tiktok_url || null,
          others_url: formData.others_url || null,
          review_url: formData.review_url || null,
          is_trending: formData.is_trending,
          is_featured: formData.is_featured,
        }).eq('id', product.id)

        if (updateError) throw updateError

        toast.success("Produk berhasil diperbarui!")
        router.push("/admin/dashboard")
        router.refresh()
      } catch (err: any) {
        toast.error(err.message)
      }
    })
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container max-w-5xl py-10 px-4">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-slate-200">
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Produk</h1>
              <p className="text-slate-500 text-sm">Update detail produk Pilihan Pintar lo.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Informasi Utama</CardTitle>
                <CardDescription>Detail nama, harga, dan kategori produk.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Nama Produk</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Masukkan nama produk..."
                    className="bg-slate-50/50 border-slate-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Harga (IDR)</Label>
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                      className="bg-slate-50/50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Kategori</Label>
                    <Input 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="bg-slate-50/50 border-slate-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Deskripsi</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    rows={6} 
                    className="bg-slate-50/50 border-slate-200"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Link Afiliasi & Review</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-600"><ShoppingBag className="w-4 h-4" /> Shopee Link</Label>
                  <Input value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} className="bg-slate-50/50 border-slate-200" placeholder="https://shope.ee/..." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-600"><Video className="w-4 h-4" /> TikTok Link</Label>
                  <Input value={formData.tiktok_url} onChange={e => setFormData({...formData, tiktok_url: e.target.value})} className="bg-slate-50/50 border-slate-200" placeholder="https://tiktok.com/..." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-600"><LinkIcon className="w-4 h-4" /> Link Lainnya</Label>
                  <Input value={formData.others_url} onChange={e => setFormData({...formData, others_url: e.target.value})} className="bg-slate-50/50 border-slate-200" placeholder="Tokopedia, Web, dll." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-600"><Video className="w-4 h-4" /> Review Link</Label>
                  <Input value={formData.review_url} onChange={e => setFormData({...formData, review_url: e.target.value})} className="bg-slate-50/50 border-slate-200" placeholder="YouTube/IG Video" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Foto Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-square relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs">Klik untuk ganti foto</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-slate-700">Trending</span>
                  </div>
                  <Switch checked={formData.is_trending} onCheckedChange={v => setFormData({...formData, is_trending: v})} />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-700">Featured</span>
                  </div>
                  <Switch checked={formData.is_featured} onCheckedChange={v => setFormData({...formData, is_featured: v})} />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-12 rounded-xl" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Simpan Produk
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}