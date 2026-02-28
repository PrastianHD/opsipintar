"use client"

import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, PlusCircle, LogOut, ChevronRight } from "lucide-react"
import Image from "next/image"
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
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
        <Image
          src="/logo.png"
          alt="Opsi Pintar"
          width={140}
          height={56}
          className="h-10 w-auto object-contain"
        />
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
          <Image
            src="/logo.png"
            alt="Opsi Pintar"
            width={100}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}