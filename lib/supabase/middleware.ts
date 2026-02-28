"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Email atau password salah. Coba lagi."
            : error.message
        )
        return
      }

      router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background texture: subtle diagonal grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(197,160,89,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Gold glow top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Login card */}
      <div className="relative w-full max-w-sm">

        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-gold shadow-[0_0_32px_rgba(197,160,89,0.4)]">
            <Sparkles className="size-7 text-navy" />
          </div>
          <div className="text-center">
            <h1 className="font-heading font-black text-2xl text-white tracking-tight">Opsi Pintar</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Admin Panel</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-navy-light/60 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">

          <div className="mb-6">
            <h2 className="font-heading font-bold text-lg text-white">Masuk ke Dashboard</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Akses khusus untuk pengelola katalog.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@opsipintar.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 bg-white/8 border border-white/10 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder:text-white/25 border border-white/10 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-300">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !email || !password}
              className={[
                "mt-2 w-full py-3.5 rounded-xl font-heading font-bold text-sm tracking-wide transition-all",
                "bg-gold text-navy shadow-[0_4px_16px_rgba(197,160,89,0.35)]",
                "hover:bg-gold-light hover:shadow-[0_6px_24px_rgba(197,160,89,0.5)]",
                "active:scale-[0.98]",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
              ].join(" ")}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Halaman ini khusus untuk pengelola Opsi Pintar.
        </p>
      </div>
    </div>
  )
}
