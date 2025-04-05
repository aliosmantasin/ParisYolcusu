import React from "react";
import { useTranslations } from "next-intl";
import BigScreen from "./firstGlanceAirportComp/BigScreen";
import MobilScreen from "./firstGlanceAirportComp/MobilScreen";

const FirstGlanceAirPort = () => {
  const t = useTranslations("ParisHavalimanı");
  
  // Get translations for the child components
  const title = t("firstGlance.title");
  const span = t("firstGlance.span");

  return (
    <section className="w-full bg-[#ffffff] dark:bg-black relative">
      {/* Masaüstü Görünümü */}
      <BigScreen title={title} span={span} />
      {/* Mobil Görünüm */}
      <MobilScreen title={title} span={span} />
    </section>
  );
};

export default FirstGlanceAirPort;