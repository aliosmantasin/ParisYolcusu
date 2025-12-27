import React from 'react'

import CDGairport from '../_components/ParisHavalimanıTransfer/CDGairport'
import OurVehicles from '../_components/homepage/OurVehicles'
import CallToActionComponent from '../_components/homepage/CallToActionComponent'
import { seoData } from '@/lib/seo'
import { Metadata } from 'next'
import { getLocalizedPath } from '@/lib/i18n'
import Gallery from '../_components/homepage/Galery'
import AlwaysIncluded from '../_components/homepage/AlwaysIncluded'
import Services from '../_components/homepage/Services'

type Props = {
  params: Promise<{ locale: 'tr' | 'en' | 'fr' }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // params'ı bekle
  const resolvedParams = await params;
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
    {/* <FirstGlanceAirPort/> */}
    <CDGairport/>
     <Services/>
     <AlwaysIncluded/>
    {/* <ORLYairport/> */}
    {/* <BVAairport/> */}
    <OurVehicles/>
    <Gallery/>
    <CallToActionComponent/>
    </>
  )
}

export default ParisAirPortsTransfer

export async function generateStaticParams() {
  return [
    { locale: 'tr'},
    { locale: 'en'},
    { locale: 'fr'},
  ]
}