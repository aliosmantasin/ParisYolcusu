"use client";

import Script from "next/script";
import { useCookieConsent } from "../../context/CookieConsentContext";

export function GoogleAnalyticsScript() {
  const { consent, hasInteracted } = useCookieConsent();
  
  // Kullanıcı izin vermediyse veya henüz etkileşimde bulunmadıysa hiçbir şey yükleme
  if (!hasInteracted || !consent.analytics) {
    return null;
  }

  return (
    <>
      {/* Google Analytics'i sadece kullanıcı açıkça izin verdiyse yükle */}
      <Script
        id="google-analytics-load"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-X8BS5XMQ68`}
      />
      
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X8BS5XMQ68', {
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `
        }}
      />
    </>
  );
} 