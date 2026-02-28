import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const search = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""

  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (category && category !== "Semua") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data as Product[], {
    headers: {
      // Cache for 60 seconds at the edge — adjust to taste
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}