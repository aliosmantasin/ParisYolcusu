'use client';

import { useEffect } from 'react';

export function SecurityProvider() {
  useEffect(() => {
    // Sağ tıklamayı engelle
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Metin seçimini engelle
    const handleSelect = (e: Event) => {
      e.preventDefault();
    };

    // Görselleri koruma
    const protectImages = () => {
      const images = document.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('dragstart', (e) => e.preventDefault());
        images[i].addEventListener('contextmenu', (e) => e.preventDefault());
      }
    };

    // Event listener'ları ekle
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelect);
    protectImages();

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelect);
    };
  }, []);

  return null;
} 