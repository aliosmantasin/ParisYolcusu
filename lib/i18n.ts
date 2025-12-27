export const urlMap: Record<string, { tr: string; en: string; fr: string }> = {
    anasayfa: { tr: "/tr", en: "/en", fr: "/fr" },

    "charles-de-gaulle-havalimani-transfer": { 
      tr: "charles-de-gaulle-havalimani-transfer", 
      en: "paris-airport-transfer",
      fr: "transfert-aeroport-paris"
    },

    "paris-gezi-turlari": { 
      tr: "paris-gezi-turlari", 
      en: "paris-sightseeing-tours",
      fr: "visites-guidees-paris"
    },

    '/iletisim': {
      tr: '/iletisim',
      en: '/contact',
      fr: '/contact'
    },

    "rezervasyon-formu": { 
      tr: "rezervasyon-formu", 
      en: "reservation-form",
      fr: "formulaire-reservation"
    },

    "/cerez-politikasi": {
      tr: '/cerez-politikasi',
      en: '/cookie-policy',
      fr: '/politique-cookies'
    },

    "/gizlilik-politikasi": {
      tr: '/gizlilik-politikasi',
      en: '/privacy-policy',
      fr: '/politique-confidentialite'
    },
  };

// Dil bazlı URL yolu alma fonksiyonu
export function getLocalizedPath(path: string, locale: 'tr' | 'en' | 'fr'): string {
  // URL haritasında bu yol var mı kontrol et
  if (path in urlMap) {
    return urlMap[path][locale];
  }
  
  // Yoksa orijinal yolu döndür
  return path;
}

// Dil bazlı URL yolu oluşturma fonksiyonu
export function createLocalizedUrl(path: string, locale: 'tr' | 'en' | 'fr'): string {
  // Önce URL haritasında bu yol var mı kontrol et
  const mappedPath = Object.keys(urlMap).find(key => 
    urlMap[key][locale === 'tr' ? 'en' : locale === 'en' ? 'tr' : 'fr'] === path
  );
  
  if (mappedPath) {
    return `/${locale}/${urlMap[mappedPath][locale]}`;
  }
  
  // Eğer haritada yoksa, doğrudan yolu kullan
  return `/${locale}/${path}`;
}
  