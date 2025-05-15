"use client";

import Script from "next/script";
import { useCookieConsent } from "../../context/CookieConsentContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { useEffect } from "react";

// Google Consent Mode sinyali gönderen yardımcı fonksiyon
function sendGtagConsent(consent: { analytics: boolean; marketing: boolean }) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const params = {
      'ad_storage': consent.marketing ? 'granted' : 'denied',
      'analytics_storage': consent.analytics ? 'granted' : 'denied',
      'ad_personalization': consent.marketing ? 'granted' : 'denied',
      'ad_user_data': consent.marketing ? 'granted' : 'denied'
    };
    window.gtag('consent', 'update', params);
    console.log('[ConsentMode] gtag consent update sent', params);
  } else {
    console.log('[ConsentMode] gtag not available when trying to send update');
  }
}

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
    // Kullanıcı etkileşimi sonrası Google'a güncel consent sinyali gönder
    if (hasInteracted) {
      sendGtagConsent(consent);
    }
  }, [consent.analytics, consent.marketing, hasInteracted]);
  
  // Consent Mode default sinyalini her zaman gönder
  // (Google Analytics ve Tag Manager scriptlerinden önce çalışmalı)
  return (
    <>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_personalization': 'denied',
              'ad_user_data': 'denied'
            });
            console.log('[ConsentMode] gtag consent default sent', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_personalization: 'denied',
              ad_user_data: 'denied'
            });
          `
        }}
      />

      {/* Google Tag Manager - Her zaman yüklenir */}
      <GoogleTagManager gtmId="GTM-NJC2MR8S" />

      {/* Google Analytics - Her zaman yüklenir */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X8BS5XMQ68"
      />
      
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            gtag('config', 'G-X8BS5XMQ68', {
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `
        }}
      />
      
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