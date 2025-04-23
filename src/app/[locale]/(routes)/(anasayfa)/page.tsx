import CallToActionComponent from "../_components/homepage/CallToActionComponent";
import FeaturesBrand from "../_components/homepage/FeaturesBrand";
import FirstGlance from "../_components/homepage/FirstGlance";
import Services from "../_components/homepage/Services";
// import Testimonials from "../_components/homepage/Testimonials";
import { QuestionsSSS } from "../_components/homepage/QuestionsSSS";
import AboutComponent from "../_components/homepage/AboutComponent";
import CleanCar from "../_components/homepage/CleanCar";
import OurVehicles from "../_components/homepage/OurVehicles";
import ParisAirportTransfer from "../_components/homepage/ParisAirPort";
import { seoData } from "@/lib/seo";
import { Metadata } from "next";
import Galery from "../_components/homepage/Galery";
import Script from "next/script";

type Props = {
  params: Promise<{ locale?: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale ?? "tr";
  const pagePath = `/${locale}`;

  console.log("📌 Kullanılan dil:", locale);

  const seo = seoData[pagePath] || {
    title: "Varsayılan Başlık",
    description: "Varsayılan Açıklama",
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

export default function Home() {
  // Ana sayfa için kapsamlı JSON-LD yapısı
  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Paris Yolcusu - Paris Türk Şoförlü VIP Transfer Hizmeti",
    "description": "Charles de Gaulle Havalimanı Transfer (CDG) - Orly Havalimanı Transfer (ORY) - Aeroport Le Bourget - Paris Özel Jet Karşılama ve VIP transfer hizmetleri sunuyoruz. Profesyonel şoförlerimiz ve lüks araçlarımızla Paris'te konforlu seyahat deneyimi.",
    "url": "https://parisyolcusu.com",
    "inLanguage": "tr",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Paris Yolcusu",
      "url": "https://parisyolcusu.com",
      "description": "Paris'te VIP transfer ve özel jet karşılama hizmetleri",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://parisyolcusu.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    "about": {
      "@type": "LocalBusiness",
      "name": "Paris Yolcusu",
      "image": "https://res.cloudinary.com/dppmtyact/image/upload/v1744625041/havalimaniGorsel3_cfyyk7.webp",
      "description": "Paris'te VIP transfer ve özel jet karşılama hizmetleri sunan profesyonel bir şirket.",
   

      "url": "https://parisyolcusu.com",
      "telephone": "+33 6 34 99 38 83",
      "priceRange": "€€€",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],

      },
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61575087150340",
        "https://www.instagram.com/paris.yolcusu/",
     
      ]
    },
 
    "image": [
      {
        "@type": "ImageObject",
        "contentUrl": "https://res.cloudinary.com/dppmtyact/image/upload/v1744625041/havalimaniGorsel3_cfyyk7.webp",
        "name": "Aeroport Le Bourget Özel Jet Karşılama",
        "description": "Aeroport Le Bourget'de özel jet karşılama hizmeti"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://res.cloudinary.com/dppmtyact/image/upload/v1744625041/havalimaniGorsel2_namc3b.webp",
        "name": "Aeroport Le Bourget Özel Jet Karşılama",
        "description": "Aeroport Le Bourget'de özel jet karşılama hizmeti"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://res.cloudinary.com/dppmtyact/image/upload/v1744625040/havalimaniGorsel1_wahkoe.webp",
        "name": "Aeroport Le Bourget Özel Jet Karşılama",
        "description": "Aeroport Le Bourget'de özel jet karşılama hizmeti"
      }
    ],
    "video": [
      {
        "@type": "VideoObject",
        "name": "Paris Türk Şoförlü VIP Transfer Hizmeti",
        "description": "Paris VIP transfer hizmetlerimizden örnek bir video",
        "thumbnailUrl": "https://res.cloudinary.com/dppmtyact/image/upload/v1744626313/Kapak-100_ngsrzr.jpg",
        "contentUrl": "https://res.cloudinary.com/dppmtyact/video/upload/v1744625037/ParisRefVideo1_wkwyhx.mp4",
        "uploadDate": "2024-03-14",
        "duration": "PT1M",
        "embedUrl": "https://res.cloudinary.com/dppmtyact/video/upload/v1744625037/ParisRefVideo1_wkwyhx.mp4"
      }
    ],
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Paris'te VIP transfer hizmeti nasıl alabilirim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paris'te VIP transfer hizmeti almak için web sitemizden rezervasyon yapabilir veya bizi telefonla arayabilirsiniz. Profesyonel şoförlerimiz ve lüks araçlarımızla size en konforlu seyahat deneyimini sunuyoruz."
          }
        },
        {
          "@type": "Question",
          "name": "Aeroport Le Bourget'den Paris şehir merkezine ne kadar sürer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Aeroport Le Bourget'den Paris şehir merkezine ortalama 30-45 dakika sürmektedir. Trafik durumuna göre bu süre değişebilir."
          }
        }
      ]
    }
  };

  return (
    <>
      {/* Ana sayfa için kapsamlı JSON-LD yapısı */}
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      
      <FirstGlance/>
      <Services/>
      <OurVehicles/>
      <Galery/>
      <ParisAirportTransfer/>
      <FeaturesBrand/>
      {/* <Referance/> */}
  
      {/* <Testimonials/> */}
      <QuestionsSSS/>
      <CleanCar/>
      <AboutComponent/>
      <CallToActionComponent/>
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