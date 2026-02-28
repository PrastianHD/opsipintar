"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react"

function LoginFormContent() {
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get("error")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    // Keep your existing submit logic here
    // e.preventDefault()
    // setIsLoading(true)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-navy">Alamat Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input 
              type="email" 
              name="email"
              required
              placeholder="admin@opsipintar.com" 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-navy">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input 
              type="password" 
              name="password"
              required
              placeholder="••••••••" 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full mt-2 bg-navy hover:bg-navy/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-md hover:shadow-lg"
      >
        {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
        {!isLoading && <ArrowRight className="size-4" />}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    // Using a soft orange background for better contrast and readability
    <main className="min-h-screen w-full flex items-center justify-center bg-orange-50 p-4">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5 border border-orange-100">
            <ShieldCheck className="size-8 text-gold" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">Opsi Pintar Admin</h1>
          <p className="text-gray-500 text-sm mt-1.5">Silakan login untuk mengelola katalog produk</p>
        </div>

        {/* Form Card Container */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <Suspense fallback={<div className="text-sm text-center text-gray-500 py-8 animate-pulse">Memuat form...</div>}>
            <LoginFormContent />
          </Suspense>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
          &copy; {new Date().getFullYear()} Opsi Pintar. All rights reserved.
        </p>
      </div>
    </main>
  )
}