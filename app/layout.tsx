import type { Metadata, Viewport } from 'next'
import { Montserrat, Poppins, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import FomoPopup from '@/components/ui/fomopopup';
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Opsi Pintar - Rekomendasi Produk Terbaik',
  description: 'Temukan produk viral, gadget keren, dan solusi hemat pilihan terbaik. Cek di Shopee & TikTok Shop sekarang!',
  openGraph: {
    title: 'Opsi Pintar - Rekomendasi Produk Terbaik',
    description: 'Produk viral, gadget keren, solusi hemat. Dikurasi untuk Anda.',
    type: 'website',
    locale: 'id_ID',
    images: [{ url: '/logo.png' }],
  },
  icons: {
    // Semua favicon/icon pakai logo.png dari public/
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#001F5B',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${montserrat.variable} ${poppins.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <FomoPopup />
        <Analytics />
      </body>
    </html>
  )
}