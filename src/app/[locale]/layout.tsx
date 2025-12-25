import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";

import CookieConsentBanner from "../../components/CookieConsent/CookieConsentBanner";
import ConditionalScripts from "../../components/CookieConsent/ConditionalScripts";
import { CookieConsentProvider } from "@/src/components/CookieConsent/CookieConsentContext";
import CookieCleaner from "@/src/components/CookieConsent/CookieCleaner";
import TawkTo from "../../components/TawkTo";
import WhatsAppWidget from "../../components/WhatsAppWidget";
import { WhatsAppWidgetProvider } from "../../components/WhatsAppContext";
import WhatsAppIcon from "../../components/WhatsAppIcon";
import { IPTracker } from "../../components/tracking/IPTracker";
import { ClickTracker } from "../../components/tracking/ClickTracker";
import { ConditionalHeaderFooter } from "../../components/layout/ConditionalHeaderFooter";
import { ToastProvider } from "@/components/ui/toast";

import trMessages from "../../../messages/tr.json";
import enMessages from "../../../messages/en.json";
import frMessages from "../../../messages/fr.json";



const messagesMap = {
  tr: trMessages,
  en: enMessages,
  fr: frMessages,
};

type Locale = keyof typeof messagesMap;

// Organization JSON-LD (eski (routes)/layout.tsx'ten taşındı)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Paris Yolcusu",
  alternateName: "Paris Türk Şoförlü VIP Transfer Hizmeti",
  url: "https://parisyolcusu.com",
  logo: "https://parisyolcusu.com/images/favicon.ico/android-icon-192x192.png",
  description:
    "Charles de Gaulle Havalimanı Transfer (CDG) - Orly Havalimanı Transfer (ORY) - Aeroport Le Bourget - Paris Özel Jet Karşılama ve VIP transfer hizmetleri sunuyoruz. Profesyonel şoförlerimiz ve lüks araçlarımızla Paris'te konforlu seyahat deneyimi.",
  telephone: "+33 6 34 99 38 83",
  email: "info@parisyolcusu.com",
  areaServed: {
    "@type": "City",
    name: "Paris",
    containedInPlace: {
      "@type": "Country",
      name: "France",
    },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paris Transfer Hizmetleri",
    itemListElement: [
      {
        "@type": "Service",
        name: "Paris Havalimanı Transfer Hizmeti",
        description:
          "Charles de Gaulle (CDG), Orly (ORY) ve Le Bourget havalimanlarından Paris şehir merkezine VIP transfer",
      },
      {
        "@type": "Service",
        name: "Özel Jet Karşılama",
        description:
          "Aeroport Le Bourget özel jet terminali VIP karşılama ve transfer hizmeti",
      },
      {
        "@type": "Service",
        name: "Paris Gezi ve Kültür Turları",
        description: "Özel şoför ile Paris şehir turu ve gezi hizmetleri",
      },
      {
        "@type": "Service",
        name: "Paris'te Özel Şoförlü Araç Kiralama",
        description: "Saatlik veya günlük seçeneklerle hizmet veriyoruz",
      },
      {
        "@type": "Service",
        name: "Paris Disneyland Ulaşım Hizmeti",
        description:
          "Ailenizle birlikte Disneyland Paris'e gitmeyi mi planlıyorsunuz? Özel Türk Şoförlü VIP transfer hizmeti ile Disneyland Paris'e güvenle ulaşın.",
      },
    ],
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61575087150340",
    "https://www.instagram.com/paris.yolcusu/",
  ],
};

export const metadata: Metadata = {
  title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
  description:
    "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz. Hemen rezervasyon yapın ve rahat bir yolculuğun tadını çıkarın!",
  keywords:
    "paris transfer, paris havalimanı transfer, paris vip transfer, paris özel transfer, paris şehir turu, paris otel transfer",
  authors: [{ name: "Ali Osman Taşın" }],
  creator: "SettoBox Digital Marketing",
  publisher: "SettoBox Digital Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://parisyolcusu.com"),
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/tr",
      "en-US": "/en",
      "fr-FR": "/fr",
    },
  },
  openGraph: {
    title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
    description:
      "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz.",
    url: "https://parisyolcusu.com",
    siteName: "Paris Yolcusu",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
    description:
      "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz.",
  },
  verification: {
    google: "nojSoW1CdLhiYDQ8XnjhXKsGckcs3RSKFx2QQckxgOc",
  },
  icons: {
    icon: [
      {
        url: "/images/favicon.ico/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/favicon.ico/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/images/favicon.ico/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  other: {
    "script:ld+json": JSON.stringify(organizationJsonLd),
  },
};

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "fr" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const messages = messagesMap[typedLocale] as unknown as AbstractIntlMessages;

  if (!messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CookieConsentProvider>
        <ToastProvider>
          <ConditionalHeaderFooter>
            {children}
          </ConditionalHeaderFooter>
          <WhatsAppWidgetProvider>
            <WhatsAppWidget />
            <WhatsAppIcon/>
          </WhatsAppWidgetProvider>
          <TawkTo />
          <CookieCleaner />
          <ConditionalScripts />
          <CookieConsentBanner />
          <IPTracker />
          <ClickTracker />
        </ToastProvider>
      </CookieConsentProvider>
    </NextIntlClientProvider>
  );
}
