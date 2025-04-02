import React from 'react'
import FirstGlanceAirPort from '../_components/ParisHavalimanıTransfer/FirstGlance'
import CDGairport from '../_components/ParisHavalimanıTransfer/CDGairport'


import { seoData } from '@/lib/seo'
import OurVehicles from '../_components/homepage/OurVehicles'
import CallToActionComponent from '../_components/homepage/CallToActionComponent'



export async function generateMetadata() {
  const pagePath = "paris-havalimanlari-transfer"; // Sayfanın adı belirleniyor
  console.log("generateMetadata Çalışıyor! Sayfa:", pagePath);

  const seo = seoData[pagePath] || {
    title: "Varsayılan Başlık",
    description: "Varsayılan Açıklama",
  };

  console.log("Bulunan SEO:", seo);

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