import React from 'react'

import { useTranslations } from 'next-intl'
import AnimatedFirstGlanceReservation from './AnimatedFirstGlanceReservation'

const FirstGlanceRezervation = () => {
  const t = useTranslations('HomePage')

  return (
       <section className="relative w-full bg-[#ffffff] dark:bg-black">
      {/* Masaüstü Görünümü */}
      <div className="relative mx-auto flex min-h-[30vh] flex-wrap items-center justify-center bg-[url(/images/Kapak.webp)] bg-cover bg-center sm:min-h-[45vh] sm:pb-32">
        {/* Koyu Katman - Fotoğraf net kalsın, yazı hafifçe öne çıksın */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />

        {/* İçerik */}
        <AnimatedFirstGlanceReservation
          brandNameX=""
          brandnameY=""
          title={t("firstGlance.title")}
          span={t("firstGlance.span")}
          isMobile={false}
        />
      </div>
    </section>
  )
}

export default FirstGlanceRezervation