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

const AnimatedFirstGlanceContent = ({ title, span, isMobile = false }: AnimatedFirstGlanceContentProps) => {
  return (
    <div className="relative z-10 w-full sm:w-3/5 md:w-6/12 m-auto border-[#d7eae5] dark:border-[#067481] text-white">
      {/* Orta Kısım Animasyonlu */}
      <motion.div initial="hidden" animate="visible" custom={0.4} variants={textVariants} className=" flex items-center justify-center relative">
        {!isMobile && <MdOutlineArrowLeft className="mr-1 text-4xl min-w-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />}
        <h1 className="text-xl sm:text-4xl md:text-4xl text-center font-semibold tracking-[.15em] p-4 sm:p-10 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {title}
        </h1>
        {!isMobile && <MdOutlineArrowRight className="ml-1 text-4xl min-w-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />}
      </motion.div>

      {/* Alt Yazı Animasyonlu */}
      <div className="flex justify-center w-full">
        <motion.div initial="hidden" animate="visible" custom={0.6} variants={textVariants} className="relative inline-block">
          <p className="text-sm sm:text-xl md:text-2xl font-extralight uppercase tracking-[.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {span}
          </p>
          {/* Clip-path için animasyon - VIP HİZMET altında */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={clipPathVariants}
            className="absolute z-10 top-full mt-2 left-0 w-full h-2 bg-[#fece47]"
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedFirstGlanceContent; 