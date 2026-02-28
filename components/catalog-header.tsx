"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// ─── Sticky Navbar ───────────────────────────────────────────────────────────
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
    <>
      {/* ── Banner foto (tidak sticky, di atas navbar) ── */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl">
          <Image
            src="/banner.jpg"
            alt="Opsi Pintar - Solusi Belanja Cerdas dan Hemat"
            width={1000}
            height={250}
            priority
            className="w-full h-auto max-h-[240px] object-contain object-center"
          />
        </div>
      </div>
    </>
  )
}