import Image from "next/image"

// ─── Ganti dengan link sosmed kamu ───────────────────────────────────────────
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/opsipintar",
  tiktok:    "https://tiktok.com/@opsipintar",
  shopee:    "https://shopee.co.id/opsipintar",
}

// ─── Icon SVG inline ─────────────────────────────────────────────────────────
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.55V6.78a4.85 4.85 0 01-1.07-.09z"/>
    </svg>
  )
}

function IconShopee({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a5 5 0 00-5 5H5a2 2 0 00-2 2l1 11a2 2 0 002 2h12a2 2 0 002-2l1-11a2 2 0 00-2-2h-2a5 5 0 00-5-5zm0 2a3 3 0 013 3H9a3 3 0 013-3zm0 8a2 2 0 110 4 2 2 0 010-4z"/>
    </svg>
  )
}

// ─── Footer Component ─────────────────────────────────────────────────────────
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-orange-50 border-t border-orange-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Row: Logo, Moto & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Side: Logo & Moto */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image
              src="/logo.png"
              alt="Opsi Pintar"
              width={140}
              height={56}
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm font-medium text-orange-900/70">
              Solusi Belanja Cerdas dan Hemat
            </p>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center justify-center size-10 rounded-full bg-orange-100 transition-all duration-200 hover:bg-[#E1306C]/10 hover:scale-110"
            >
              <IconInstagram className="size-5 text-orange-900/60 group-hover:text-[#E1306C] transition-colors duration-200" />
            </a>

            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="group flex items-center justify-center size-10 rounded-full bg-orange-100 transition-all duration-200 hover:bg-black/10 hover:scale-110"
            >
              <IconTikTok className="size-5 text-orange-900/60 group-hover:text-black transition-colors duration-200" />
            </a>

            <a
              href={SOCIAL_LINKS.shopee}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shopee"
              className="group flex items-center justify-center size-10 rounded-full bg-orange-100 transition-all duration-200 hover:bg-[#EE4D2D]/10 hover:scale-110"
            >
              <IconShopee className="size-5 text-orange-900/60 group-hover:text-[#EE4D2D] transition-colors duration-200" />
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-8 pt-6 border-t border-orange-200/60 flex justify-center">
          <p className="text-xs text-orange-900/50">
            © {year} Opsi Pintar. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}