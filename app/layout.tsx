import type { Metadata, Viewport } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import { Instagram, Youtube, MessageCircle, Send, Sparkles } from 'lucide-react'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Opsi Pintar - Rekomendasi Produk Pilihan',
  description: 'Temukan rekomendasi produk terbaik untuk kebutuhan Anda.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body 
        className="font-body antialiased min-h-screen flex flex-col"
        suppressHydrationWarning={true}
      >
        <main className="grow">
          {children}
        </main>

        {/* --- UPGRADED FOOTER START --- */}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              
              {/* Brand & Tagline */}
              <div className="col-span-1 md:col-span-1 space-y-4">
                <div className="flex items-center gap-2 group">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="text-xl font-bold tracking-tighter">OPSIPINTAR</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kurasi produk pilihan terbaik untuk gaya hidup Anda. Kami membantu Anda memilih dengan lebih cerdas.
                </p>
              </div>

              {/* Quick Navigation */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigasi</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Beranda</Link></li>
                  <li><Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Katalog Produk</Link></li>
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
                </ul>
              </div>

              {/* Social Media - Ini yang lo butuhin */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Sosial Media</h4>
                <div className="flex gap-3">
                  <Link href="https://instagram.com/opsipintar" target="_blank" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link href="https://tiktok.com/@opsipintar" target="_blank" className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm flex items-center justify-center">
                    <span className="text-[10px] font-black italic">TT</span>
                  </Link>
                  <Link href="https://wa.me/628123456789" target="_blank" className="p-2 rounded-xl bg-secondary hover:bg-green-500 hover:text-white transition-all shadow-sm">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                  <Link href="https://t.me/opsipintar" target="_blank" className="p-2 rounded-xl bg-secondary hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                    <Send className="h-5 w-5" />
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground italic">Follow us for daily updates!</p>
              </div>


            </div>

            <div className="mt-12 pt-8 border-t border-border/40 text-center">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} <span className="font-semibold">Opsi Pintar</span> &mdash; Rekomendasi produk pilihan terbaik untuk Anda.
              </p>
            </div>
          </div>
        </footer>
        {/* --- UPGRADED FOOTER END --- */}

        <Analytics />
      </body>
    </html>
  )
}

