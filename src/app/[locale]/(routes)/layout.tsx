import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "./_components/menu/Navbar";
import Footer from "./_components/menu/Footer";
import ScrollTop from "./_components/lib/ScrollTop/ScrollTop";
import { GoogleTagManager } from "@next/third-parties/google";
import BottomNavigation from "./_components/homepage/BottomNavigation";
import { MdKeyboardArrowUp } from "react-icons/md";
import { LocaleAwareBotProtection } from "../../../components/LocaleAwareBotProtection";

// Organization JSON-LD
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Paris Yolcusu",
  "alternateName": "Paris Türk Şoförlü VIP Transfer Hizmeti",
  "url": "https://parisyolcusu.com",
  "logo": "https://parisyolcusu.com/images/favicon.ico/android-icon-192x192.png",
  "description": "Charles de Gaulle Havalimanı Transfer (CDG) - Orly Havalimanı Transfer (ORY) - Aeroport Le Bourget - Paris Özel Jet Karşılama ve VIP transfer hizmetleri sunuyoruz. Profesyonel şoförlerimiz ve lüks araçlarımızla Paris'te konforlu seyahat deneyimi.",
  "telephone": "+33 6 34 99 38 83",
  "email": "info@parisyolcusu.com",
  "areaServed": {
    "@type": "City",
    "name": "Paris",
    "containedInPlace": {
      "@type": "Country",
      "name": "France"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Paris Transfer Hizmetleri",
    "itemListElement": [
      {
        "@type": "Service",
        "name": "Paris Havalimanı Transfer Hizmeti",
        "description": "Charles de Gaulle (CDG), Orly (ORY) ve Le Bourget havalimanlarından Paris şehir merkezine VIP transfer"
      },
      {
        "@type": "Service",
        "name": "Özel Jet Karşılama",
        "description": "Aeroport Le Bourget özel jet terminali VIP karşılama ve transfer hizmeti"
      },
      {
        "@type": "Service",
        "name": "Paris Gezi ve Kültür Turları",
        "description": "Özel şoför ile Paris şehir turu ve gezi hizmetleri"
      },
      {
        "@type": "Service",
        "name": "Paris'te Özel Şoförlü Araç Kiralama",
        "description": "Saatlik veya günlük seçeneklerle hizmet veriyoruz"
      },
      {
        "@type": "Service",
        "name": "Paris Disneyland Ulaşım Hizmeti",
        "description": "Ailenizle birlikte Disneyland Paris'e gitmeyi mi planlıyorsunuz? Özel Türk Şoförlü VIP transfer hizmeti ile Disneyland Paris'e güvenle ulaşın."
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61575087150340",
    "https://www.instagram.com/paris.yolcusu/"
  ]
};

export const metadata: Metadata = {
  title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
  description: "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz. Hemen rezervasyon yapın ve rahat bir yolculuğun tadını çıkarın!",
  keywords: "paris transfer, paris havalimanı transfer, paris vip transfer, paris özel transfer, paris şehir turu, paris otel transfer",
  authors: [{ name: "Ali Osman Taşın" }],
  creator: "SettoBox Digital Marketing",
  publisher: "SettoBox Digital Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://parisyolcusu.com'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr',
      'en-US': '/en',
      'fr-FR': '/fr',
    },
  },
  openGraph: {
    title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
    description: "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz.",
    url: 'https://parisyolcusu.com',
    siteName: 'Paris Yolcusu',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
    description: "Paris'te konforlu ve güvenilir VIP transfer hizmeti!",
  },
  verification: {
    google: "nojSoW1CdLhiYDQ8XnjhXKsGckcs3RSKFx2QQc",
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon.ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon.ico/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon.ico/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicon.ico/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "script:ld+json": JSON.stringify(organizationJsonLd),
  },
};

export default async function RoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <LocaleAwareBotProtection />
      <Navbar/>
      <GoogleTagManager gtmId="GTM-NJC2MR8S"/>
      <div>
        {children} 
      </div>
      <ScrollTop>
        <MdKeyboardArrowUp />
      </ScrollTop>
      <BottomNavigation/>
      <Footer/>
    </>
  );
}

 

