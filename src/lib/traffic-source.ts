import { NextRequest } from 'next/server';

export interface TrafficSourceResult {
  trafficSource: string;
  trafficMedium: string;
  trafficCampaign: string | null;
  confidence: 'high' | 'medium' | 'low';
  detectionMethod: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
}

/**
 * Trafik kaynağını belirleme fonksiyonu
 * Öncelik sırası: Click ID'ler > UTM > Referer
 */
export function determineTrafficSource(request: NextRequest): TrafficSourceResult {
  const url = request.nextUrl;
  const referer = request.headers.get('referer');
  
  // UTM parametrelerini yakala
  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');
  const utmCampaign = url.searchParams.get('utm_campaign');
  const utmTerm = url.searchParams.get('utm_term');
  const utmContent = url.searchParams.get('utm_content');
  
  // Click ID'leri yakala
  const gclid = url.searchParams.get('gclid');
  const fbclid = url.searchParams.get('fbclid');
  
  // 1. EN YÜKSEK ÖNCELİK: Google Click ID (gclid)
  if (gclid) {
    return {
      trafficSource: 'google_ads',
      trafficMedium: 'cpc',
      trafficCampaign: utmCampaign,
      confidence: 'high',
      detectionMethod: 'gclid',
      utmSource,
      utmMedium: utmMedium || 'cpc',
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      fbclid: null,
    };
  }
  
  // 2. EN YÜKSEK ÖNCELİK: Facebook Click ID (fbclid)
  if (fbclid) {
    return {
      trafficSource: 'meta_ads',
      trafficMedium: 'cpc',
      trafficCampaign: utmCampaign,
      confidence: 'high',
      detectionMethod: 'fbclid',
      utmSource,
      utmMedium: utmMedium || 'cpc',
      utmCampaign,
      utmTerm,
      utmContent,
      gclid: null,
      fbclid,
    };
  }
  
  // 3. UTM parametrelerine göre tespit
  if (utmSource && utmMedium) {
    const sourceLower = utmSource.toLowerCase();
    const mediumLower = utmMedium.toLowerCase();
    
    // Google Ads (UTM ile)
    if (sourceLower === 'google' && mediumLower === 'cpc') {
      return {
        trafficSource: 'google_ads',
        trafficMedium: 'cpc',
        trafficCampaign: utmCampaign,
        confidence: 'high',
        detectionMethod: 'utm',
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid: null,
        fbclid: null,
      };
    }
    
    // Meta Ads (UTM ile)
    if ((sourceLower === 'facebook' || sourceLower === 'instagram' || sourceLower === 'meta') 
        && (mediumLower === 'cpc' || mediumLower === 'social')) {
      return {
        trafficSource: mediumLower === 'cpc' ? 'meta_ads' : 'meta_organic',
        trafficMedium: mediumLower,
        trafficCampaign: utmCampaign,
        confidence: 'high',
        detectionMethod: 'utm',
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid: null,
        fbclid: null,
      };
    }
    
    // Organik trafik
    if (mediumLower === 'organic') {
      return {
        trafficSource: 'organic',
        trafficMedium: 'organic',
        trafficCampaign: utmCampaign,
        confidence: 'high',
        detectionMethod: 'utm',
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid: null,
        fbclid: null,
      };
    }
  }
  
  // 4. Referer analizi
  if (referer) {
    try {
      const refUrl = new URL(referer);
      const hostname = refUrl.hostname.toLowerCase();
      const searchParams = refUrl.search;
      
      // Google domain'leri
      if (hostname.includes('google.') && !hostname.includes('googleads')) {
        if (searchParams.includes('aclk') || searchParams.includes('adurl')) {
          return {
            trafficSource: 'google_ads',
            trafficMedium: 'cpc',
            trafficCampaign: utmCampaign,
            confidence: 'high',
            detectionMethod: 'referer_google_ads',
            utmSource,
            utmMedium: utmMedium || 'cpc',
            utmCampaign,
            utmTerm,
            utmContent,
            gclid: null,
            fbclid: null,
          };
        }
        
        // Organik Google arama
        const refPath = refUrl.pathname.toLowerCase();
        if (refPath === '/search' || refPath.startsWith('/search')) {
          return {
            trafficSource: 'google_organic',
            trafficMedium: 'organic',
            trafficCampaign: utmCampaign,
            confidence: 'medium',
            detectionMethod: 'referer_google',
            utmSource,
            utmMedium: utmMedium || 'organic',
            utmCampaign,
            utmTerm,
            utmContent,
            gclid: null,
            fbclid: null,
          };
        }
      }
      
      // Meta (Facebook/Instagram) domain'leri
      if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
        if (searchParams.includes('clid') || searchParams.includes('clickid')) {
          return {
            trafficSource: 'meta_ads',
            trafficMedium: 'cpc',
            trafficCampaign: utmCampaign,
            confidence: 'medium',
            detectionMethod: 'referer_meta_ads',
            utmSource,
            utmMedium: utmMedium || 'cpc',
            utmCampaign,
            utmTerm,
            utmContent,
            gclid: null,
            fbclid: null,
          };
        }
        
        return {
          trafficSource: 'meta_organic',
          trafficMedium: 'social',
          trafficCampaign: utmCampaign,
          confidence: 'medium',
          detectionMethod: 'referer_meta',
          utmSource,
          utmMedium: utmMedium || 'social',
          utmCampaign,
          utmTerm,
          utmContent,
          gclid: null,
          fbclid: null,
        };
      }
      
      // Diğer referrer'lar
      return {
        trafficSource: 'referral',
        trafficMedium: 'referral',
        trafficCampaign: utmCampaign,
        confidence: 'low',
        detectionMethod: 'referer_other',
        utmSource,
        utmMedium: utmMedium || 'referral',
        utmCampaign,
        utmTerm,
        utmContent,
        gclid: null,
        fbclid: null,
      };
    } catch (e) {
      // URL parse hatası
    }
  }
  
  // 5. Referer yoksa direct
  return {
    trafficSource: 'direct',
    trafficMedium: 'none',
    trafficCampaign: utmCampaign,
    confidence: 'low',
    detectionMethod: 'no_referer',
    utmSource,
    utmMedium: utmMedium || null,
    utmCampaign,
    utmTerm,
    utmContent,
    gclid: null,
    fbclid: null,
  };
}

