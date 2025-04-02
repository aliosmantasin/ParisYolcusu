import HeroSection from '../_components/ParisGeziTurları/HeroSection';
import PopularAttractions from '../_components/ParisGeziTurları/PopularAttractions';
import ServiceFeatures from '../_components/ParisGeziTurları/ServiceFeatures';
import CTASection from '../_components/ParisGeziTurları/CTASection';
import OurVehicles from '../_components/homepage/OurVehicles';
import { seoData } from '@/lib/seo';


export async function generateMetadata() {
  const pagePath = "paris-sightseeing-tours"; // Sayfanın adı belirleniyor
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

export default function ParisGeziTurlar() {
  return (
    <main>
      <HeroSection />
      <PopularAttractions />
      <ServiceFeatures />
      <OurVehicles/>
      <CTASection />
    </main>
  );
}
