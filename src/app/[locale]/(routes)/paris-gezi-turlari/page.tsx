import { Metadata } from 'next';
import HeroSection from '../_components/ParisGeziTurları/HeroSection';
import PopularAttractions from '../_components/ParisGeziTurları/PopularAttractions';
import ServiceFeatures from '../_components/ParisGeziTurları/ServiceFeatures';
import CallToActionComponent from '../_components/homepage/CallToActionComponent';

import OurVehicles from '../_components/homepage/OurVehicles';
import { seoData } from '@/lib/seo';
import { getLocalizedPath } from '@/lib/i18n';

type Props = {
  params: Promise<{ locale: 'tr' | 'en' | 'fr' }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params'ı bekle
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Doğru sayfa yolunu oluştur
  const pageKey = getLocalizedPath('paris-gezi-turlari', locale);
  const pagePath = pageKey;

  console.log("📌 Kullanılan dil:", locale);
  console.log("📌 Sayfa yolu:", pagePath);

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
export default function ParisGeziTurlar() {
  return (
    <main>
      <HeroSection />
      <PopularAttractions />
      <ServiceFeatures />
      <OurVehicles/>
      <CallToActionComponent/>
    </main>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'fr' },
  ]
}
