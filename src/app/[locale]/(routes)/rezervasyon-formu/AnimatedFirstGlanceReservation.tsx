"use client"
import React from 'react'
import { motion } from "framer-motion";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";

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

interface AnimatedFirstGlanceContentProps {
  brandNameX: string;
  brandnameY: string;
  title: string;
  span: string;
  isMobile?: boolean;
}

const AnimatedFirstGlanceReservation = ({ title, span, isMobile = false }: AnimatedFirstGlanceContentProps) => {
  return (
    <div className="relative z-10 mx-auto w-full sm:w-3/5 md:w-6/12 text-white px-4 sm:px-6">
      {/* Orta Kısım Animasyonlu */}
      <motion.div initial="hidden" animate="visible" custom={0.4} variants={textVariants} className="relative flex items-center justify-center text-center">
        {!isMobile && <MdOutlineArrowLeft className="mr-1 text-4xl min-w-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />}
        <h1 className="px-2 py-3 text-2xl font-semibold leading-relaxed tracking-[.18em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:px-6 sm:py-6 sm:text-4xl md:text-4xl">
          {title}
        </h1>
        {!isMobile && <MdOutlineArrowRight className="ml-1 text-4xl min-w-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />}
      </motion.div>

      {/* Alt Yazı Animasyonlu */}
      <div className="flex w-full justify-center">
        <motion.div initial="hidden" animate="visible" custom={0.6} variants={textVariants} className="relative inline-block">
          <p className="text-xs font-light uppercase tracking-[.35em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-sm md:text-base">
            {span}
          </p>
          {/* Clip-path için animasyon - VIP HİZMET altında */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={clipPathVariants}
            className="absolute left-0 top-full z-10 mt-2 h-1 w-full bg-[#fece47]"
      ></motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default AnimatedFirstGlanceReservation; 