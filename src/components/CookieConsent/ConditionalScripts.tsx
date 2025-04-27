"use client";

import Script from "next/script";
import { useCookieConsent } from "../../context/CookieConsentContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { useEffect } from "react";
import { GoogleAnalyticsScript } from "./GoogleAnalyticsScript";

export default function ConditionalScripts() {
  const { consent, hasInteracted } = useCookieConsent();
  
  // Google Analytics ve diğer izleme script'lerini tamamen devre dışı bırakmak için
  useEffect(() => {
    // Analytics çerezleri reddedildi ise Google Analytics'i devre dışı bırak
    if (hasInteracted && !consent.analytics) {
      // Define a global window property to disable GA tracking
      window['ga-disable-G-X8BS5XMQ68'] = true;
      
      // Mevcut GA çerezlerini temizle
      const gaCookies = document.cookie.split(';').filter(cookie => 
        cookie.trim().startsWith('_ga') || 
        cookie.trim().startsWith('_gid') || 
        cookie.trim().startsWith('_gat')
      );
      
      gaCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });
    } else if (hasInteracted && consent.analytics) {
      // Enable GA if consent given
      window['ga-disable-G-X8BS5XMQ68'] = false;
    }
  }, [consent.analytics, hasInteracted]);
  
  // Don't load any scripts if the user hasn't interacted with the banner
  if (!hasInteracted) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - Load only if analytics OR marketing consent is granted */}
      {(consent.analytics || consent.marketing) && (
        <GoogleTagManager gtmId="GTM-NJC2MR8S" />
      )}
      
      {/* Google Analytics - Yeni bileşen üzerinden yükleniyor */}
      <GoogleAnalyticsScript />
      
      {/* Microsoft Clarity - Analytics */}
      {consent.analytics && (
        <>
          <Script 
            id="clarity-script"
            strategy="afterInteractive"
            src="https://www.clarity.ms/s/0.8.1/clarity.js"
          />
          <Script 
            id="clarity-tag"
            strategy="afterInteractive"
            src="https://www.clarity.ms/tag/qucnqkp488"
          />
        </>
      )}
      
      {/* Facebook Pixel - Marketing */}
      {consent.marketing && (
        <>
          <Script 
            id="facebook-pixel-config"
            strategy="afterInteractive"
            src="https://connect.facebook.net/signals/config/9590651744311913?v=2.9.199&r=stable&domain=www.parisyolcusu.com"
          />
          <Script 
            id="facebook-pixel-events"
            strategy="afterInteractive"
            src="https://connect.facebook.net/en_US/fbevents.js"
          />
        </>
      )}
      
      {/* You can add other direct scripts here as needed */}
      {consent.functional && (
        // Add any functional-specific scripts here
        <></>
      )}
    </>
  );
} 