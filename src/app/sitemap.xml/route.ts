import { NextResponse } from "next/server";

const baseUrl = "https://parisyolcusu.com";
const lastModifiedDate = new Date().toISOString().split("T")[0];

// URL mappings from middleware
const urlMappings: Record<string, Record<string, string>> = {
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
};

export async function GET() {
  const locales = ["tr", "en", "fr"];
  const pages = [
    "",
    "paris-havalimanlari-transfer",
    "paris-gezi-turlari",
    "bilgi-alma-formu",
    "rezervasyon-formu"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${locales.flatMap(locale => 
        pages.map(page => {
          // Get the localized path for this page and locale
          let localizedPath = page;
          if (page && urlMappings[`/${page}`]) {
            localizedPath = urlMappings[`/${page}`][locale].replace(/^\//, '');
          }
          
          return `
            <url>
              <loc>${baseUrl}/${locale}${localizedPath ? `/${localizedPath}` : ''}</loc>
              <lastmod>${lastModifiedDate}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>${page === "" ? "1.0" : "0.8"}</priority>
            </url>
          `;
        })
      ).join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
