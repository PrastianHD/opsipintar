'use client';
import { useState, useEffect } from 'react';

const actions = [
  'baru saja melihat produk ini 👀',
  'baru saja klik link produk ini! ⚡',
  'baru saja memasuki website 👋',
  'sedang mengecek detail produk 🔍'
];

const generateRandomName = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const getRandomChar = () => letters[Math.floor(Math.random() * letters.length)];
  
  const first = getRandomChar();
  const second = getRandomChar();
  const third = getRandomChar();
  
  return `${first}${second}${third}***`;
};

export default function FomoPopup() {
  const [notification, setNotification] = useState<{name: string, action: string} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = generateRandomName();
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      setNotification({ name: randomName, action: randomAction });

      setTimeout(() => setNotification(null), 5000);
    }, 12000 * 2); 

    return () => clearInterval(interval);
  }, []);

  if (!notification) return null;

  return (
    // PERUBAHAN STYLING:
    // border-l-4 border-blue-600 -> Garis aksen tebal di sebelah kiri (Bisa diganti warna brand lu)
    // shadow-[0_8px_30px_rgb(0,0,0,0.12)] -> Shadow custom yang lebih soft dan elegan
    // ring-1 ring-black/5 -> Border tipis natural khas desain Apple/Vercel
    <div className="fixed top-10 right-4 z-999 bg-white border-l-4 border-blue-600 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 rounded-xl flex items-center gap-4 transition-all duration-500 animate-in slide-in-from-right-8 fade-in">
      
      {/* Icon Background - Sesuaikan warnanya dengan aksen border di atas */}

      <div className="flex flex-col">
        <p className="text-sm text-gray-600 leading-snug">
          <span className="font-bold text-gray-900">{notification.name}</span>{' '}
          {notification.action}
        </p>
        {/* Tambahan efek "Verified" biar makin meyakinkan */}
        <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          Terverifikasi
        </p>
      </div>
    </div>
  );
}