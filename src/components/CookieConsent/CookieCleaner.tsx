"use client";

import { useEffect, useCallback } from "react";
import { useCookieConsent } from "./CookieConsentContext";

// Temizlenecek çerezlerin listesi
const COOKIE_PATTERNS = {
  analytics: [
    '_ga',      // Google Analytics
    '_gid',     // Google Analytics
    '_gat',     // Google Analytics
    '_clck',    // Microsoft Clarity
    '_clsk',    // Microsoft Clarity
  ],
  marketing: [
    '_fbp',     // Facebook Pixel
    '_fbc',     // Facebook Pixel
    '_tt_',     // TikTok Pixel
    'IDE',      // Google DoubleClick
    '_gcl_',    // Google Ads
  ],
  functional: [
    // Fonksiyonel çerezler buraya eklenebilir
  ]
};

export default function CookieCleaner() {
  const { consent, hasInteracted } = useCookieConsent();

  // Domain seviyelerini alma
  const getDomainLevels = (hostname: string): string[] => {
    const parts = hostname.split('.');
    const domains = [''];
    
    if (parts.length > 2) {
      // Alt alan adları için
      for (let i = 1; i < parts.length - 1; i++) {
        domains.push(`domain=.${parts.slice(i).join('.')};`);
      }
    }
    
    // Ana domain için
    domains.push(`domain=.${hostname};`);
    
    return domains;
  };

  // Çerezleri temizleme fonksiyonu
  const cleanupCookies = useCallback((cookiePrefixes: string[]) => {
    if (typeof document === 'undefined') return;

    const allCookies = document.cookie.split(';');
    const domains = getDomainLevels(window.location.hostname);
    
    for (const cookie of allCookies) {
      const cookieName = cookie.split('=')[0].trim();
      
      // Eğer çerez verilen öneklerden biriyle başlıyorsa sil
      if (cookiePrefixes.some(prefix => cookieName.startsWith(prefix))) {
        // Tüm olası path ve domain kombinasyonlarında çerezi sil
        for (const domain of domains) {
          for (const path of ['/', '/*/']) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain}`;
          }
        }
        
        console.log(`[CookieCleaner] Removed: ${cookieName}`);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasInteracted) return; // Henüz etkileşim yoksa hiçbir şey yapma

    // Her bir consent tipi için çerezleri kontrol et
    Object.entries(consent).forEach(([type, isAllowed]) => {
      if (!isAllowed && COOKIE_PATTERNS[type as keyof typeof COOKIE_PATTERNS]) {
        cleanupCookies(COOKIE_PATTERNS[type as keyof typeof COOKIE_PATTERNS]);
      }
    });

  }, [consent, hasInteracted, cleanupCookies]);

  return null;
} 