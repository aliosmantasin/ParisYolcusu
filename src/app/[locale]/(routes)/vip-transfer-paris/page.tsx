import VipTransferParisFirstGlance from "../_components/homepage/VipTransferParisFirstGlance";
import VipTransferParisHero from "../_components/homepage/VipTransferParisHero";
import { seoData } from "@/lib/seo";
import { Metadata } from "next";
import Script from "next/script";
import AlwaysIncluded from "../_components/homepage/AlwaysIncluded";
import OurVehicles from "../_components/homepage/OurVehicles";
import Gallery from "../_components/homepage/Galery";
import DisneylandTransferHero from "../_components/homepage/DisneylandTransferHero";
import RelatedTransfers from "../_components/homepage/RelatedTransfers";

type Props = {
  params: Promise<{ locale?: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale ?? "tr";
  const pagePath = `/${locale}/vip-transfer-paris`;

  console.log("📌 Kullanılan dil:", locale);

  const seo = seoData[pagePath] || {
    title: locale === "tr" 
      ? "Paris Kapıdan Kapıya VIP Transfer | VIP Transfer Paris | Paris Yolcusu"
      : locale === "en"
      ? "Paris Door to Door VIP Transfer | VIP Transfer Paris | Paris Traveler"
      : "Transfert VIP Porte à Porte Paris | Transfert VIP Paris | Paris Voyageur",
    description: locale === "tr"
      ? "Paris Kapıdan Kapıya VIP Transfer hizmeti! Türkiye'den gelen yolcular için iş ziyaretleri, müzeler, havalimanları, oteller ve Paris şehir merkezi VIP transfer. Hemen rezervasyon yapın!"
      : locale === "en"
      ? "Paris Door to Door VIP Transfer service! VIP transfers for passengers from Turkey to business visits, museums, airports, hotels and Paris city center. Book now!"
      : "Service de transfert VIP porte à porte à Paris ! Transferts VIP pour les passagers de Turquie vers les visites d'affaires, musées, aéroports, hôtels et centre-ville de Paris. Réservez maintenant !",
  };

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function VipTransferParis() {
  // VIP Transfer Paris sayfası için JSON-LD yapısı
  const vipTransferJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VIP Transfer Paris - Paris Yolcusu",
    "description": "Paris Kapıdan Kapıya VIP Transfer hizmeti! Türkiye'den gelen yolcular için iş ziyaretleri, müzeler, havalimanları, oteller ve Paris şehir merkezi VIP transfer.",
    "url": "https://parisyolcusu.com/vip-transfer-paris",
    "inLanguage": "tr",
    "about": {
      "@type": "LocalBusiness",
      "name": "Paris Yolcusu",
      "description": "Paris'te VIP transfer ve özel jet karşılama hizmetleri sunan profesyonel bir şirket.",
      "url": "https://parisyolcusu.com",
      "telephone": "+33 6 34 99 38 83",
      "priceRange": "€€€",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61575087150340",
        "https://www.instagram.com/paris.yolcusu/",
      ]
    },
    "mainEntity": {
      "@type": "Service",
      "serviceType": "VIP Transfer Service",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Paris Yolcusu"
      },
      "areaServed": {
        "@type": "City",
        "name": "Paris"
      },
      "description": "Paris'te VIP transfer hizmetleri: havalimanı transferi, özel şehir turları, otel transferleri"
    }
  };

  return (
    <>
      {/* VIP Transfer Paris sayfası için JSON-LD yapısı */}
      <Script
        id="vip-transfer-paris-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vipTransferJsonLd) }}
      />
      
      <VipTransferParisFirstGlance/>
      <VipTransferParisHero/>
      <AlwaysIncluded/>
      <OurVehicles/>
      <Gallery/>
      <DisneylandTransferHero/>
      <RelatedTransfers/>
    </>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}