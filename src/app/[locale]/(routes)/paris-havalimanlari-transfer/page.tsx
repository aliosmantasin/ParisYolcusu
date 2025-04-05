import React from 'react'
import FirstGlanceAirPort from '../_components/ParisHavalimanıTransfer/FirstGlanceAirPort'
import CDGairport from '../_components/ParisHavalimanıTransfer/CDGairport'
import OurVehicles from '../_components/homepage/OurVehicles'
import CallToActionComponent from '../_components/homepage/CallToActionComponent'
import { seoData } from '@/lib/seo'
import { Metadata } from 'next'
import { getLocalizedPath } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: 'tr' | 'en' }> | { locale: 'tr' | 'en' }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params'ı bekle
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Doğru sayfa yolunu oluştur
  const pageKey = getLocalizedPath('paris-havalimanlari-transfer', locale);
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

const ParisAirPortsTransfer = () => {
  
  return (
    <>
    <FirstGlanceAirPort/>
    <CDGairport/>
    {/* <ORLYairport/> */}
    {/* <BVAairport/> */}
    <OurVehicles/>
    <CallToActionComponent/>
    </>
  )
}

export default ParisAirPortsTransfer

export async function generateStaticParams() {
  return [
    { locale: 'tr'},
    { locale: 'en'},
  ]
}