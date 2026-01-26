import React from 'react'


import AnimatedFirstGlanceReservation from './AnimatedFirstGlanceReservation'

const FirstGlanceRezervation = () => {
  // const t = useTranslations('HomePage')

  return (
       <section className="relative w-full bg-[#ffffff] dark:bg-black">
      {/* Masaüstü Görünümü */}
      <div className="relative mx-auto flex min-h-[30vh] flex-wrap items-center justify-center bg-[url(/images/Kapak.webp)] bg-cover bg-center sm:min-h-[45vh] sm:pb-32">
        {/* Koyu Katman - Fotoğraf net kalsın, yazı hafifçe öne çıksın */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/60" />

        {/* İçerik */}
        <AnimatedFirstGlanceReservation
    
          title="Paris VIP Transfer"
          span="Hızlı Rezervasyon Formu"
          isMobile={false}
        />
      </div>
    </section>
  )
}

export default FirstGlanceRezervation