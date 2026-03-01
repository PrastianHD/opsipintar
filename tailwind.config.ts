import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Kasih tau Tailwind folder mana aja yang pake class CSS
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 2. Di sini lu bisa nambahin warna official "Opsi Pintar" nanti
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // 3. Plugin sakti biar animasi slide-in lu jalan di Vercel
  plugins: [require("tailwindcss-animate")],
};

export default config;