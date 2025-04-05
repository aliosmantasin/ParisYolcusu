import { NextResponse } from "next/server";

const baseUrl = "https://parisyolcusu.com";
const lastModifiedDate = new Date().toISOString().split("T")[0];

export async function GET() {
  const pages = [
    "",
    "paris-airport-transfer",
    "paris-sightseeing-tours",
    "paris-gezi-turlari",
    "paris-havalimanlari-transfer"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>${baseUrl}/${page}</loc>
          <lastmod>${lastModifiedDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>
      `).join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
