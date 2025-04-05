import React from 'react'
import { useTranslations } from 'next-intl';
import AnimatedContent from './AnimatedContent';

const BigFirstGlance = () => {
  const t = useTranslations("HomePage");

  return (
    <div>
      <div className="container hidden sm:flex flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10 relative h-[775px] bg-[url(/images/banner.webp)] bg-cover bg-center">
        {/* Koyu Katman */}
        <div className="absolute inset-0 bg-black opacity-25"></div>

        {/* İçerik */}
        <AnimatedContent
          brandNameX={t("firstGlance.brandNameX")}
          brandnameY={t("firstGlance.brandnameY")}
          title={t("firstGlance.title")}
          span={t("firstGlance.span")}
        />
      </div>
    </div>
  )
}

export default BigFirstGlance 