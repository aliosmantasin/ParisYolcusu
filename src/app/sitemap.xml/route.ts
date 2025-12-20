import { NextResponse } from "next/server";

const baseUrl = "https://parisyolcusu.com";
const lastModifiedDate = new Date().toISOString().split("T")[0];

// URL mappings from middleware - matches src/middleware.ts pathnames
const pathnames: Record<string, string | Record<string, string>> = {
  '/': '/',
  '/paris-havalimanlari-transfer': {
    tr: '/paris-havalimanlari-transfer',
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
  '/hakkimizda': {
    tr: '/hakkimizda',
    en: '/about-us',
    fr: '/a-propos'
  },
};

const locales = ["tr", "en", "fr"] as const;

// Helper function to get localized path
function getLocalizedPath(path: string, locale: typeof locales[number]): string {
  const pathConfig = pathnames[path];
  
  if (!pathConfig) {
    return path;
  }
  
  if (typeof pathConfig === 'string') {
    return pathConfig;
  }
  
  return pathConfig[locale];
}

export async function GET() {
  const pages = Object.keys(pathnames);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${locales.flatMap(locale => 
  pages.map(path => {
    const localizedPath = getLocalizedPath(path, locale);
    const isHomePage = path === '/';
    const priority = isHomePage ? "1.0" : "0.8";
    const changefreq = isHomePage ? "daily" : "weekly";
    
    return `  <url>
    <loc>${baseUrl}/${locale}${localizedPath === '/' ? '' : localizedPath}</loc>
              <lastmod>${lastModifiedDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${locales.map(altLocale => {
      if (altLocale === locale) return '';
      const altPath = getLocalizedPath(path, altLocale);
      return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${altPath === '/' ? '' : altPath}" />`;
    }).filter(Boolean).join('\n')}
  </url>`;
        })
).join('\n')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
