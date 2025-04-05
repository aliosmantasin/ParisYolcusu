export const urlMap: Record<string, { tr: string; en: string }> = {
    anasayfa: { tr: "/tr", en: "/en" },

    "paris-havalimanlari-transfer": { 
      tr: "paris-havalimanlari-transfer", 
      en: "paris-airport-transfer" 
    },

    "paris-gezi-turlari": { 
      tr: "paris-gezi-turlari", 
      en: "paris-sightseeing-tours" 
    },

    "rezervasyon-formu": { 
      tr: "rezervasyon-formu", 
      en: "reservation-form" 
    },
  };

// Dil bazlı URL yolu alma fonksiyonu
export function getLocalizedPath(path: string, locale: 'tr' | 'en'): string {
  // URL haritasında bu yol var mı kontrol et
  if (path in urlMap) {
    return urlMap[path][locale];
  }
  
  // Yoksa orijinal yolu döndür
  return path;
}

// Dil bazlı URL yolu oluşturma fonksiyonu
export function createLocalizedUrl(path: string, locale: 'tr' | 'en'): string {
  // Önce URL haritasında bu yol var mı kontrol et
  const mappedPath = Object.keys(urlMap).find(key => 
    urlMap[key][locale === 'tr' ? 'en' : 'tr'] === path
  );
  
  if (mappedPath) {
    return `/${locale}/${urlMap[mappedPath][locale]}`;
  }
  
  // Eğer haritada yoksa, doğrudan yolu kullan
  return `/${locale}/${path}`;
}
  