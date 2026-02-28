"use client"

import { Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function CatalogHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const prev = lastYRef.current
        setScrolled(y > 80)
        if (y > 120) setVisible(y < prev)
        else setVisible(true)
        lastYRef.current = y
        tickingRef.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "bg-navy text-white sticky top-0 z-30",
        "transition-[transform,padding,box-shadow] duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled ? "py-2 shadow-[0_4px_24px_rgba(0,31,91,0.3)]" : "py-10 sm:py-14",
      ].join(" ")}
    >
      {/* Subtle gold shimmer line along top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Full Hero (at top) ── */}
        <div
          className={[
            "flex flex-col items-center text-center gap-3 transition-all duration-300 overflow-hidden",
            scrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-60 opacity-100",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            {/* Gold icon badge */}
            <div className="flex items-center justify-center size-11 rounded-xl bg-gold shadow-[0_2px_12px_rgba(197,160,89,0.5)]">
              <Sparkles className="size-5 text-navy" />
            </div>
            {/* Brand name — Montserrat heading */}
            <h1 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
              Opsi Pintar
            </h1>
          </div>

          {/* Tagline — Poppins body (default font) */}
          <p className="max-w-md text-sm leading-relaxed sm:text-base"
             style={{ color: 'rgba(255,255,255,0.75)' }}>
            Rekomendasi produk terbaik yang sudah dikurasi. Temukan pilihan cerdas untuk gaya hidup Anda.
          </p>

          {/* Gold divider rule */}
          <div className="mt-1 h-px w-20 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* ── Compact Bar (when scrolled) ── */}
        <div
          className={[
            "flex items-center gap-3 transition-all duration-300 overflow-hidden",
            scrolled ? "max-h-12 opacity-100" : "max-h-0 opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div className="flex items-center justify-center size-7 rounded-lg bg-gold shadow-sm shrink-0">
            <Sparkles className="size-3.5 text-navy" />
          </div>
          <span className="font-heading font-black text-base tracking-tight">Opsi Pintar</span>
          <span className="ml-auto text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Katalog Produk Terkurasi
          </span>
        </div>
      </div>
    </header>
  )
}
