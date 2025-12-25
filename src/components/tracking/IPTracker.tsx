"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * IP Tracker Component
 * Client-side IP loglama - Endüstri standardı (Google Analytics yaklaşımı)
 * Middleware overhead'i yok, sadece sayfa yüklendiğinde bir kez çalışır
 * Non-blocking, fire-and-forget
 */
export function IPTracker() {
  const pathname = usePathname();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    // Her sayfa değişiminde sıfırla
    hasLoggedRef.current = false;

    // Admin sayfalarında takip etme
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }

    // Sadece bir kez loglama yap (sayfa yüklendiğinde)
    if (hasLoggedRef.current) {
      return;
    }

    // URL parametrelerini al (UTM, gclid, fbclid vb.)
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    const gclid = urlParams.get('gclid');
    const fbclid = urlParams.get('fbclid');

    // Trafik kaynağını belirle (basit client-side logic)
    let trafficSource = 'direct';
    let trafficMedium = 'none';
    let detectionMethod = 'no_referer';

    if (gclid) {
      trafficSource = 'google_ads';
      trafficMedium = 'cpc';
      detectionMethod = 'gclid';
    } else if (fbclid) {
      trafficSource = 'meta_ads';
      trafficMedium = 'cpc';
      detectionMethod = 'fbclid';
    } else if (utmSource && utmMedium) {
      const utmSourceLower = utmSource.toLowerCase();
      const utmMediumLower = utmMedium.toLowerCase();
      
      if (utmSourceLower === 'google' && utmMediumLower === 'cpc') {
        trafficSource = 'google_ads';
        trafficMedium = 'cpc';
      } else if ((utmSourceLower === 'facebook' || utmSourceLower === 'instagram' || utmSourceLower === 'meta') 
                 && (utmMediumLower === 'cpc' || utmMediumLower === 'social')) {
        trafficSource = 'meta_ads';
        trafficMedium = 'cpc';
      } else if (utmMediumLower === 'organic') {
        trafficSource = 'organic';
        trafficMedium = 'organic';
      } else if (utmMediumLower === 'email') {
        trafficSource = 'email';
        trafficMedium = 'email';
      } else if (utmMediumLower === 'social') {
        trafficSource = 'social';
        trafficMedium = 'social';
      } else if (utmMediumLower === 'cpc' || utmMediumLower === 'ppc') {
        trafficSource = 'paid';
        trafficMedium = utmMediumLower;
      }
      detectionMethod = 'utm';
    } else if (document.referrer) {
      try {
        const refererUrl = new URL(document.referrer);
        const hostname = refererUrl.hostname.toLowerCase();
        
        if (hostname.includes('google.') && !hostname.includes('googleads')) {
          if (refererUrl.search.includes('aclk') || refererUrl.search.includes('adurl')) {
            trafficSource = 'google_ads';
            trafficMedium = 'cpc';
            detectionMethod = 'referer_google_ads';
          } else {
            trafficSource = 'google_organic';
            trafficMedium = 'organic';
            detectionMethod = 'referer_google';
          }
        } else if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
          trafficSource = 'meta_organic';
          trafficMedium = 'social';
          detectionMethod = 'referer_meta';
        } else {
          trafficSource = 'referral';
          trafficMedium = 'referral';
          detectionMethod = 'referer_other';
        }
      } catch {
        // URL parse hatası - sessizce devam et
      }
    }

    // IP loglama için API'ye istek gönder (fire-and-forget)
    const logData = {
      path: window.location.pathname,
      method: 'GET',
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      gclid: gclid || null,
      fbclid: fbclid || null,
      trafficSource,
      trafficMedium,
      detectionMethod,
    };

    // navigator.sendBeacon kullan (non-blocking, sayfa kapanırken bile gönderir)
    const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/ip-log', blob);
    } else {
      // Fallback: fetch with keepalive
      fetch('/api/ip-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
        keepalive: true,
      }).catch(() => {
        // Hataları sessizce yok say
      });
    }

    hasLoggedRef.current = true;
  }, [pathname]);

  return null; // Bu component görsel bir şey render etmez
}

