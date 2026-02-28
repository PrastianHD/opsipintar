import { createClient } from "@/lib/supabase/server"
// Hapus kurung kurawalnya karena itu export default
import EditProductClient from "./edit-product-client" 
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !product) notFound()

  // Sekarang EditProductClient sudah terdefinisi (bukan undefined lagi)
  return <EditProductClient product={product} />
}