import React from "react";
import { useTranslations } from "next-intl";
import AnimatedFirstGlanceContent from "./AnimatedFirstGlanceContent";
import BannerInfoForm from "./BannerInfoForm";
import NewYearPromoBanner from "./NewYearPromoBanner";

const FirstGlance = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="w-full bg-[#ffffff] dark:bg-black relative">
      {/* Yılbaşı İndirim ve Erken Rezervasyon Banner'ı */}
      <NewYearPromoBanner />
      
      {/* Masaüstü Görünümü */}
      <div className="min-h-[20vh] sm:flex flex-wrap justify-center items-center sm:min-h-[60vh] mx-auto bg-[url(/images/Kapak.webp)] bg-cover bg-center relative sm:pb-32">
        {/* Koyu Katman */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

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
      <div className="relative px-4 mt-8 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:transform sm:translate-y-1/2 z-20">
        <BannerInfoForm />
      </div>
 
    </section>
  );
};

export default FirstGlance;
