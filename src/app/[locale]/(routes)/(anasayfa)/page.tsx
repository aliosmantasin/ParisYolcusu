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
  params: Promise<{ locale?: string }>; // ✅ params artık Promise olarak tanımlandı
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // ✅ Promise olan params'ı çöz
  const locale = resolvedParams.locale ?? "tr"; // ✅ Varsayılan dili "tr" yap
  const pagePath = `/${locale}`;

  console.log("📌 Gelen params:", resolvedParams);
  console.log("📌 Kullanılan dil:", locale);

  const seo = seoData[pagePath] || {
    title: "Varsayılan Başlık",
    description: "Varsayılan Açıklama",
  };

  return {
    title: seo.title,
    description: seo.description,
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
