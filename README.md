<div align="center">
  <img src="https://www.opsipintar.site/logo.png" alt="Opsi Pintar Logo" width="180" />

  <h1>Opsi Pintar</h1>
  <p><strong>Solusi Belanja Cerdas dan Hemat 🛒</strong></p>

  <p>
    Platform rekomendasi produk terbaik — dikurasi dari Shopee & TikTok Shop untuk kamu yang mau belanja lebih pintar.
  </p>

  <p>
    <a href="https://www.opsipintar.site" target="_blank">🌐 Live Website</a> ·
    <a href="https://instagram.com/opsipintar" target="_blank">📸 Instagram</a> ·
    <a href="https://tiktok.com/@opsipintar" target="_blank">🎵 TikTok</a> ·
    <a href="https://shopee.co.id/opsipintar" target="_blank">🛍️ Shopee</a>
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
  ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
  ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

</div>

---

## 📖 Tentang Proyek

**Opsi Pintar** adalah website rekomendasi produk yang mengkurasi produk-produk viral, gadget keren, dan barang hemat dari berbagai kategori. Setiap produk dilengkapi dengan link pembelian langsung ke Shopee dan TikTok Shop, memudahkan pengguna untuk berbelanja dengan cerdas.

### Fitur Utama

- 🔍 **Filter Kategori** — Semua, Viral, Gadget, Rumah, Fashion Cowok, Fashion Cewek, Kebutuhan Dapur, Digital, dan lainnya
- 🛒 **Dual Marketplace** — Link beli langsung ke Shopee & TikTok Shop di setiap produk
- 👁️ **Quick View** — Preview produk tanpa berpindah halaman
- 📱 **Responsive Design** — Tampilan optimal di semua ukuran layar
- 🔐 **Admin Panel** — Manajemen produk dengan autentikasi Supabase (rute `/admin`)
- 📊 **Analytics** — Tracking pengunjung via Vercel Analytics

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework dengan App Router |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [Radix UI](https://www.radix-ui.com/) | Headless UI components |
| [Supabase](https://supabase.com/) | Database & autentikasi (SSR) |
| [Vercel Analytics](https://vercel.com/analytics) | Web analytics |
| [Lucide React](https://lucide.dev/) | Icon library |
| [shadcn/ui](https://ui.shadcn.com/) | Component library berbasis Radix |

---

## 🚀 Memulai Pengembangan

### Prasyarat

Pastikan kamu sudah menginstal:
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [pnpm](https://pnpm.io/) (package manager yang digunakan di proyek ini)

```bash
npm install -g pnpm
```

### Instalasi

1. **Clone repositori**

```bash
git clone https://github.com/PrastianHD/opsipintar.git
cd opsipintar
```

2. **Install dependensi**

```bash
pnpm install
```

3. **Buat file environment**

Buat file `.env.local` di root proyek dan isi dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Nilai ini bisa ditemukan di dashboard Supabase kamu: **Settings → API**.

4. **Jalankan server development**

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Proyek

```
opsipintar/
├── app/                  # Next.js App Router (halaman & layouts)
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & Supabase client
├── public/               # Aset statis (logo, banner, dll.)
├── scripts/              # Script utilitas
├── styles/               # Global CSS
├── middleware.ts          # Auth middleware (proteksi rute /admin)
├── next.config.ts         # Konfigurasi Next.js
├── tailwind.config.ts     # Konfigurasi Tailwind CSS
└── tsconfig.json          # Konfigurasi TypeScript
```

---

## 🔐 Admin Panel

Rute `/admin` dilindungi oleh middleware autentikasi Supabase. Untuk mengakses:

1. Buka `/admin/login`
2. Login dengan akun Supabase yang sudah terdaftar
3. Setelah login berhasil, kamu akan diarahkan ke dashboard admin

Middleware secara otomatis mengamankan semua rute di bawah `/admin/*` dan me-redirect pengguna yang belum terautentikasi ke halaman login.

---

## 📦 Scripts yang Tersedia

```bash
pnpm dev      # Jalankan server development (localhost:3000)
pnpm build    # Build untuk produksi
pnpm start    # Jalankan server produksi
pnpm lint     # Cek linting dengan ESLint
```

---

## ☁️ Deployment

Proyek ini di-deploy di **[Vercel](https://vercel.com)** dengan CI/CD otomatis via GitHub Actions.

Setiap push ke branch `main` akan memicu build dan deploy ulang secara otomatis.

Untuk deploy manual ke Vercel:

```bash
pnpm build
# atau langsung via Vercel CLI
vercel --prod
```

Pastikan environment variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`) sudah dikonfigurasi di dashboard Vercel.

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Berikut langkah-langkahnya:

1. Fork repositori ini
2. Buat branch fitur baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambahkan nama-fitur'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini bersifat privat. © 2026 Opsi Pintar. All rights reserved.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh <a href="https://github.com/PrastianHD">PrastianHD</a></p>
  <p>
    <a href="https://www.opsipintar.site">opsipintar.site</a>
  </p>
</div>
