import React from "react";
import { useTranslations } from "next-intl";
import AnimatedFirstGlanceContent from "./AnimatedFirstGlanceContent";

const FirstGlance = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="w-full bg-[#ffffff] dark:bg-black relative">
      {/* Masaüstü Görünümü */}
      <div className="container hidden sm:flex flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10 relative h-[775px] bg-[url(/images/banner.webp)] bg-cover bg-center">
        {/* Koyu Katman */}
        <div className="absolute inset-0 bg-black opacity-25"></div>

        {/* İçerik */}
        <AnimatedFirstGlanceContent
          brandNameX={t("firstGlance.brandNameX")}
          brandnameY={t("firstGlance.brandnameY")}
          title={t("firstGlance.title")}
          span={t("firstGlance.span")}
          isMobile={false}
        />
      </div>

      {/* Mobil Görünüm */}
      <div className="container flex sm:hidden flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10 relative h-[auto] bg-[url(/images/banner2.webp)] bg-cover bg-center">
        {/* Koyu Katman */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* İçerik */}
        <AnimatedFirstGlanceContent
          brandNameX={t("firstGlance.brandNameX")}
          brandnameY={t("firstGlance.brandnameY")}
          title={t("firstGlance.title")}
          span={t("firstGlance.span")}
          isMobile={true}
        />
      </div>
    </section>
  );
};

export default FirstGlance;
