-- Create products table for Opsi Pintar catalog
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price BIGINT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  shopee_url TEXT,
  tiktok_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (catalog is public)
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

-- Seed sample product data
INSERT INTO public.products (title, description, price, category, image_url, shopee_url, tiktok_url) VALUES
  ('Wireless Earbuds Pro', 'Earbuds nirkabel dengan noise cancelling aktif, bass mendalam, dan baterai tahan 30 jam.', 249000, 'Gadget', 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Smart Watch Ultra', 'Smartwatch dengan layar AMOLED, tracking kesehatan lengkap, dan tahan air IP68.', 459000, 'Gadget', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Mini Projector HD', 'Proyektor portabel 1080p dengan koneksi WiFi dan speaker built-in.', 899000, 'Gadget', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Aroma Diffuser LED', 'Diffuser aromaterapi dengan lampu LED 7 warna dan kapasitas 300ml.', 129000, 'Rumah', 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Organizer Serbaguna', 'Rak organizer multi-fungsi dari bambu premium untuk meja kerja rapi.', 189000, 'Rumah', 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Lampu Meja Minimalis', 'Lampu LED sentuh dengan 3 level kecerahan dan desain Skandinavia.', 159000, 'Rumah', 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Tumbler Viral 1L', 'Tumbler stainless steel viral dengan sedotan, tahan panas dan dingin 24 jam.', 79000, 'Opsi Viral', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Ring Light 10 Inch', 'Ring light profesional 10 inci dengan tripod dan holder HP untuk konten kreator.', 149000, 'Opsi Viral', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Skincare Organizer Putar', 'Rak putar 360 derajat untuk skincare dan makeup, hemat ruang meja rias.', 99000, 'Opsi Viral', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Kabel Data 3-in-1', 'Kabel pengisian cepat 100W kompatibel USB-C, Lightning, dan Micro USB.', 35000, 'Hemat', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Holder HP Fleksibel', 'Holder HP lazy bracket bisa ditekuk ke segala arah, cocok untuk di kasur.', 29000, 'Hemat', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Mouse Pad XL', 'Mouse pad ekstra besar 80x30cm anti slip, desain premium hitam.', 45000, 'Hemat', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Toolkit Reparasi 25pcs', 'Set alat reparasi lengkap 25 pcs untuk HP, laptop, dan gadget elektronik.', 89000, 'Solusi', 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Desiccant Box Anti Lembab', 'Box penyerap kelembaban reusable untuk lemari, brankas, dan storage.', 55000, 'Solusi', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop'),
  ('Pest Repeller Ultrasonik', 'Pengusir hama ultrasonik tanpa bahan kimia, aman untuk anak dan hewan peliharaan.', 75000, 'Solusi', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', 'https://shopee.co.id', 'https://tiktok.com/shop');
