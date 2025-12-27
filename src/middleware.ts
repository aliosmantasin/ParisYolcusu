import createMiddleware from "next-intl/middleware";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URL yönlendirme kuralları
const pathnames = {
  '/': '/',
  '/charles-de-gaulle-havalimani-transfer': {
    tr: '/charles-de-gaulle-havalimani-transfer',
    en: '/paris-airport-transfer',
    fr: '/transfert-aeroport-paris'
  },
  '/paris-gezi-turlari': {
    tr: '/paris-gezi-turlari',
    en: '/paris-sightseeing-tours',
    fr: '/visites-guidees-paris'
  },
  '/rezervasyon-formu': {
    tr: '/rezervasyon-formu',
    en: '/reservation-form',
    fr: '/formulaire-reservation'
  },
  '/iletisim': {
    tr: '/iletisim',
    en: '/contact',
    fr: '/contact'
  },
   '/cerez-politikasi': {
    tr: '/cerez-politikasi',
    en: '/cookie-policy',
    fr: '/politique-cookies'
  },
};

// Desteklenen diller
const locales = ["tr", "en", "fr"] as const;
type Locale = typeof locales[number];

// Tarayıcı dilini algılama fonksiyonu
function getBrowserLocale(request: NextRequest): Locale {
  // Accept-Language header'ını al
  const acceptLanguage = request.headers.get("accept-language") || "";
  
  // Desteklenen dilleri kontrol et
  const browserLocales = acceptLanguage.split(",").map(lang => {
    const locale = lang.split(";")[0].trim().toLowerCase();
    // Check for exact matches first
    if (locale === "en" || locale === "en-us" || locale === "en-gb") return "en";
    if (locale === "tr" || locale === "tr-tr") return "tr";
    if (locale === "fr" || locale === "fr-fr") return "fr";
    
    // Then check for partial matches
    if (locale.startsWith("en")) return "en";
    if (locale.startsWith("tr")) return "tr";
    if (locale.startsWith("fr")) return "fr";
    
    return null;
  }).filter((locale): locale is Locale => locale !== null);

  // İlk eşleşen dili döndür veya varsayılan dili kullan
  return browserLocales[0] || "tr";
}

// Middleware oluştur
const middleware = createMiddleware({
  locales,
  defaultLocale: "tr",
  pathnames,
  localePrefix: 'always',
  localeDetection: true,
});

// Middleware'i dışa aktar
export default async function middlewareHandler(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Tarayıcı dilini algıla
  const browserLocale = getBrowserLocale(request);
  
  // Eğer URL'de dil belirtilmemişse, tarayıcı diline göre yönlendir
  if (!pathname.startsWith("/tr") && !pathname.startsWith("/en") && !pathname.startsWith("/fr")) {
    return NextResponse.redirect(new URL(`/${browserLocale}${pathname}`, request.url));
  }

  const response = await middleware(request);
  
  // Admin login sayfası için pathname'i header'a ekle (layout'ta kullanmak için)
  if (pathname.includes('/admin/login')) {
    if (response) {
      const newResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      newResponse.headers.set('x-pathname', pathname);
      return newResponse;
    }
  }
  
  
  // Cache-Control header'larını ekle
  if (response) {
    const headers = new Headers(response.headers);
    
    // Statik içerik için cache
    if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|css|js)$/)) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Dinamik içerik için cache
    else {
      headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    
    // Security headers
    headers.set('X-DNS-Prefetch-Control', 'on');
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  
  return response;
}

// Matcher yapılandırması
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // API veya statik dosyalara dokunma
};
