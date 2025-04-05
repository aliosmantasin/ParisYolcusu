import CallToActionComponent from "../_components/homepage/CallToActionComponent";
import FeaturesBrand from "../_components/homepage/FeaturesBrand";
import FirstGlance from "../_components/homepage/FirstGlance";
import Services from "../_components/homepage/Services";
import Testimonials from "../_components/homepage/Testimonials";
import { QuestionsSSS } from "../_components/homepage/QuestionsSSS";
import AboutComponent from "../_components/homepage/AboutComponent";
import CleanCar from "../_components/homepage/CleanCar";
import OurVehicles from "../_components/homepage/OurVehicles";
import ParisAirportTransfer from "../_components/homepage/ParisAirPort";
import { seoData } from "@/lib/seo";
import { Metadata } from "next";

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
  return (
    <>
      <FirstGlance/>
      <Services/>
      <OurVehicles/>
      <FeaturesBrand/>
      {/* <Referance/> */}
      <ParisAirportTransfer/>
      <Testimonials/>
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
    { locale: 'en' }
  ]
}