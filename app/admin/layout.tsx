"use client"

import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, LayoutDashboard, PlusCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"

const NAV_ITEMS = [
  { href: "/admin/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/add-product",  label: "Tambah Produk", icon: PlusCircle      },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, startLogout] = useTransition()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    startLogout(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
      router.refresh()
    })
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col bg-navy border-r border-white/8",
      mobile
        ? "w-72 h-full"
        : "hidden lg:flex w-64 min-h-screen sticky top-0 h-screen"
    )}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/8">
        <div className="flex items-center justify-center size-9 rounded-xl bg-gold shadow-[0_2px_12px_rgba(197,160,89,0.4)] shrink-0">
          <Sparkles className="size-4.5 text-navy" />
        </div>
        <div>
          <p className="font-heading font-black text-sm text-white tracking-tight">Opsi Pintar</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(197,160,89,0.7)' }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                active
                  ? "bg-gold/15 text-gold"
                  : "text-white/50 hover:bg-white/6 hover:text-white/80"
              )}
            >
              <Icon className={cn("size-4 shrink-0 transition-colors", active ? "text-gold" : "text-white/35 group-hover:text-white/60")} />
              {label}
              {active && <ChevronRight className="ml-auto size-3.5 text-gold/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:bg-red-500/10 hover:text-red-300 transition-all disabled:opacity-50"
        >
          {loggingOut
            ? <span className="size-4 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
            : <LogOut className="size-4 shrink-0" />
          }
          Keluar
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile: overlay drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full animate-in slide-in-from-left duration-300">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 bg-navy px-4 py-3 border-b border-white/8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1 p-1.5 -ml-1.5"
            aria-label="Buka menu"
          >
            <span className="w-5 h-0.5 bg-white/60 rounded-full" />
            <span className="w-4 h-0.5 bg-white/60 rounded-full" />
            <span className="w-5 h-0.5 bg-white/60 rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-lg bg-gold shrink-0">
              <Sparkles className="size-3.5 text-navy" />
            </div>
            <span className="font-heading font-black text-sm text-white">Admin Panel</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}