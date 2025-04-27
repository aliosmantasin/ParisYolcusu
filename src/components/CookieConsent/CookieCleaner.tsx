"use client";

import { useEffect } from "react";
import { useCookieConsent } from "../../context/CookieConsentContext";

export default function CookieCleaner() {
  const { consent, hasInteracted } = useCookieConsent();

  useEffect(() => {
    // Kullanıcı reddetmişse veya henüz etkileşimde bulunmamışsa çerezleri temizle
    if (!hasInteracted || !consent.analytics) {
      // Google Analytics için devre dışı bırakma bayrağını ayarla
      window['ga-disable-G-X8BS5XMQ68'] = true;
    }

    // Kullanıcı reddetmişse veya henüz etkileşimde bulunmamışsa çerezleri temizle
    if (hasInteracted && !consent.analytics) {
      // Google Analytics Çerezleri
      cleanupCookies(['_ga', '_gid', '_gat']);
    }

    if (hasInteracted && !consent.marketing) {
      // Facebook Pixel Çerezleri
      cleanupCookies(['_fbp', '_fbc']);
    }

    if (hasInteracted && !consent.functional) {
      // Fonksiyonel Çerezler (eğer varsa)
      // ...
    }
  }, [consent, hasInteracted]);

  // Çerezleri temizleme fonksiyonu
  const cleanupCookies = (cookiePrefixes: string[]) => {
    const allCookies = document.cookie.split(';');
    
    for (const cookie of allCookies) {
      const cookieName = cookie.split('=')[0].trim();
      
      // Eğer çerez verilen öneklerden biriyle başlıyorsa sil
      if (cookiePrefixes.some(prefix => cookieName.startsWith(prefix))) {
        // Çerezi temel yolda sil
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        
        // Çerezi ana alan adında sil
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        
        // Üst seviye alan adında da sil
        const domain = window.location.hostname.split('.');
        if (domain.length > 2) {
          const topLevelDomain = domain.slice(domain.length - 2).join('.');
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${topLevelDomain};`;
        }
        
        console.log(`Çerez temizlendi: ${cookieName}`);
      }
    }
  };

  // Bu bir görünmez bileşendir, hiçbir şey render etmez
  return null;
} 