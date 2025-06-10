"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useCookieConsent } from "./CookieConsentContext";

const GTM_ID = 'GTM-NJC2MR8S';

type ConsentStatus = 'granted' | 'denied';

type ConsentUpdate = {
  ad_storage: ConsentStatus;
  analytics_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
  functionality_storage: ConsentStatus;
  security_storage: ConsentStatus;
};

type GtagConsentArg = [
  'consent',
  'update' | 'default',
  ConsentUpdate & { wait_for_update?: number; region?: string[] }
];

type DataLayerEvent = Partial<ConsentUpdate> & {
  event?: string;
  'gtm.start'?: number;
  'gtm.js'?: boolean;
  wait_for_update?: number;
};

interface DataLayerObject extends Array<DataLayerEvent | (() => void)> {
  reset?: () => void;
}

declare global {
  interface Window {
    dataLayer: DataLayerObject;
    gtag?: (...args: GtagConsentArg) => void;
  }
}

// Google Consent Mode sinyali gönderen yardımcı fonksiyon
function sendGtagConsent(consent: { analytics: boolean; marketing: boolean }) {
  if (typeof window !== "undefined" && window.dataLayer) {
    // Consent Mode güncellemesi
    const consentUpdate: ConsentUpdate = {
      ad_storage: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    };

    // GTM için consent_update eventi - sadece gerekli alanları gönder
    window.dataLayer.push({
      event: 'consent_update',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied'
    });

    // Google Consent Mode için doğrudan güncelleme
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ...consentUpdate,
        region: ['TR', 'EU']
      });
    }
    
    console.log('[ConsentMode] Consent update sent:', consentUpdate);
  }
}

export default function ConditionalScripts() {
  const { consent, hasInteracted } = useCookieConsent();
  
  // Consent değişikliklerini takip et
  useEffect(() => {
    if (hasInteracted) {
      sendGtagConsent(consent);
    }
  }, [consent.analytics, consent.marketing, hasInteracted]);
  
  return (
    <>
      {/* GTM ve Consent Mode başlangıç yapılandırması */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Consent Mode ve GTM yapılandırması
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // Varsayılan olarak tüm izinleri reddet ve bölge belirt
            gtag("consent", "default", {
              ad_storage: "denied",
              analytics_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
              functionality_storage: "granted",
              security_storage: "granted",
              wait_for_update: 2000,
              region: ['TR', 'EU']
            });

            // GTM'i Consent Mode ile yükle
            (function(w,d,s,l,i){
              // Önce consent_default eventini gönder
              w[l].push({
                'event': 'consent_default',
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
              });

              // Sonra GTM'i yükle
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              // GTM yüklendiğinde consent durumunu kontrol et
              j.addEventListener('load', function() {
                console.log('[GTM] Loaded with Consent Mode enabled');
              });
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `
        }}
      />
      
      {/* GTM NoScript */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
} 