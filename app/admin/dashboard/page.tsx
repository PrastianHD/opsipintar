import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "./dashboard-client"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Dashboard fetch error:", error.message)
    return []
  }
  return data as Product[]
}

export default async function DashboardPage() {
  const products = await getProducts()
  return <DashboardClient initialProducts={products} />
}