import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Creates a Supabase client for use in middleware.
 * Handles cookie forwarding so sessions stay alive across SSR + Edge.
 * Called by middleware.ts — do not call directly in pages.
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}