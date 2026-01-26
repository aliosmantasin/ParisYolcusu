import React from "react";
import { useTranslations } from "next-intl";
import AnimatedFirstGlanceContent from "./AnimatedFirstGlanceContent";
import BannerInfoForm from "./BannerInfoForm";
import Image from "next/image";
// import NewYearPromoBanner from "./NewYearPromoBanner";

const FirstGlance = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="w-full bg-[#ffffff] dark:bg-black relative">
      {/* Yılbaşı İndirim ve Erken Rezervasyon Banner'ı */}
      {/* <NewYearPromoBanner /> */}
      
      {/* Masaüstü Görünümü */}
      <div className="min-h-[25vh] sm:flex flex-wrap justify-center items-center bg- sm:min-h-[60vh] mx-auto relative">
        {/* Koyu Katman */}
        <div className="absolute inset-0 "></div>
        <div>
          <Image src="/images/Kapak.webp" alt="Kapak" fill className="object-cover" />
        </div>
        {/* İçerik */}
        <AnimatedFirstGlanceContent
          brandNameX=""
          brandnameY=""
          title={t("firstGlance.title")}
          span={t("firstGlance.span")}
          isMobile={false}
        />
      </div>

      {/* Banner Bilgi Alma Formu - Mobilde normal akış, masaüstünde absolute */}
      <div className="relative px-4 mt-8 sm:absolute sm:bottom-5 sm:left-0 sm:right-0 sm:transform sm:translate-y-1/2 ">
        <BannerInfoForm />
      </div>
 
    </section>
  );
};

export default FirstGlance;
