"use client";
import React from "react";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const FirstGlance = () => {
  const t = useTranslations("HomePage");

  // Yazılar için yukarıdan süzülme animasyonu
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut", delay }
    })
  };

  // Clip-path için animasyon
  const clipPathVariants = {
    hidden: { clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)" },
    visible: {
      clipPath: "polygon(5% 0%, 100% 0%, 95% 95%, 55% 50%)",
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <section className="w-full bg-[#ffffff] dark:bg-black relative">

      {/* Masaüstü Görünümü */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        <div className="container hidden sm:flex flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10 relative h-[775px] bg-[url(/images/banner.jpeg)] bg-cover bg-center">
          
          {/* Koyu Katman */}
          <div className="absolute inset-0 bg-black opacity-25"></div>

          {/* İçerik */}
          <div className="relative z-10 w-full sm:w-2/5 md:w-4/9 m-auto border-[#d7eae5] dark:border-[#067481] text-white">
            
            {/* Başlıklar Animasyonlu */}
            <motion.div initial="hidden" animate="visible" custom={0} variants={textVariants}>
              <p className="text-center text-md sm:text-xl font-semibold uppercase tracking-[.15em] primary">
                {t("firstGlance.brandNameX")}
              </p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={0.2} variants={textVariants}>
              <p className="text-center text-md sm:text-xl font-semibold uppercase tracking-[.15em] primary">
                {t("firstGlance.brandnameY")}
              </p>
            </motion.div>

            {/* Orta Kısım Animasyonlu */}
            <motion.div initial="hidden" animate="visible" custom={0.4} variants={textVariants} className="flex items-center justify-center relative">
              <MdOutlineArrowLeft className="mr-1 text-4xl min-w-8" />
              <h1 className="text-xl sm:text-3xl text-center font-semibold tracking-[.15em] p-10 leading-relaxed">
                {t("firstGlance.title")}
              </h1>
              <MdOutlineArrowRight className="ml-1 text-4xl min-w-8" />
            </motion.div>

            {/* Clip-path için animasyon */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={clipPathVariants}
              className="absolute z-10 bottom-7 left-1/2 -translate-x-1/2 w-full h-5 bg-[#fece47]"
            ></motion.div>

            {/* Alt Yazı Animasyonlu */}
            <motion.div initial="hidden" animate="visible" custom={0.6} variants={textVariants}>
              <p className="text-center text-sm sm:text-xl font-extralight uppercase tracking-[.25em]">
                {t("firstGlance.span")}
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Mobil Görünüm */}
      <div className="container flex sm:hidden flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10 relative h-[auto] bg-[url(/images/banner2.jpeg)] bg-cover bg-center">
        
        {/* Koyu Katman */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* İçerik */}
        <div className="relative z-10 w-full sm:w-2/5 md:w-4/9 m-auto border-[#d7eae5] dark:border-[#067481] text-white">
          
          {/* Başlıklar Animasyonlu */}
          <motion.div initial="hidden" animate="visible" custom={0} variants={textVariants}>
            <p className="text-center text-md sm:text-xl font-semibold uppercase tracking-[.15em]">
              {t("firstGlance.brandNameX")}
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={0.2} variants={textVariants}>
            <p className="text-center text-md sm:text-xl font-semibold uppercase tracking-[.15em]">
              {t("firstGlance.brandnameY")}
            </p>
          </motion.div>

          {/* Orta Kısım Animasyonlu */}
          <motion.div initial="hidden" animate="visible" custom={0.4} variants={textVariants} className="flex items-center justify-center">
           
            <h1 className="text-xl sm:text-3xl text-center font-semibold tracking-[.15em] p-10 leading-relaxed">
              {t("firstGlance.title")}
            </h1>
          </motion.div>

          {/* Clip-path için animasyon */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={clipPathVariants}
            className="absolute z-10 bottom-7 left-1/2 -translate-x-1/2 w-full h-5 bg-[#fece47]"
          ></motion.div>

          {/* Alt Yazı Animasyonlu */}
          <motion.div initial="hidden" animate="visible" custom={0.6} variants={textVariants}>
            <p className="text-center text-sm sm:text-xl font-extralight uppercase tracking-[.25em]">
              {t("firstGlance.span")}
            </p>
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default FirstGlance;
