"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Upload, Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Link from "next/link"

export default function AddProductPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    shopee_url: "",
    tiktok_url: "",
    others_url: "",
    review_url: "",
    is_trending: false,
    is_featured: false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return toast.error("Please upload a product image")

    startTransition(async () => {
      try {
        // 1. Upload Image ke Supabase Storage
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`products/${fileName}`, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path)

        // 2. Insert ke Table Products
        const { error: insertError } = await supabase.from('products').insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: publicUrl,
          shopee_url: formData.shopee_url || null,
          tiktok_url: formData.tiktok_url || null,
          others_url: formData.others_url || null,
          review_url: formData.review_url || null,
          is_trending: formData.is_trending,
          is_featured: formData.is_featured,
        })

        if (insertError) throw insertError

        toast.success("Product added successfully!")
        router.push("/admin/dashboard")
        router.refresh()
      } catch (err: any) {
        toast.error(err.message || "Something went wrong")
      }
    })
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informasi Produk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Produk</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga (IDR)</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Link Marketplace & Review</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Shopee URL</Label>
                  <Input placeholder="https://shopee.co.id/..." value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>TikTok Shop URL</Label>
                  <Input placeholder="https://tiktok.com/..." value={formData.tiktok_url} onChange={e => setFormData({...formData, tiktok_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Lainnya (Tokped/Web)</Label>
                  <Input placeholder="Link marketplace lain..." value={formData.others_url} onChange={e => setFormData({...formData, others_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Review URL (Video/Blog)</Label>
                  <Input placeholder="https://youtube.com/..." value={formData.review_url} onChange={e => setFormData({...formData, review_url: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Gambar Produk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900 group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
                    <p className="text-xs text-zinc-500 font-medium">Click to upload image</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status & Visibilitas</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Trending 🔥</Label>
                <Switch checked={formData.is_trending} onCheckedChange={v => setFormData({...formData, is_trending: v})} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured ⭐</Label>
                <Switch checked={formData.is_featured} onCheckedChange={v => setFormData({...formData, is_featured: v})} />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}