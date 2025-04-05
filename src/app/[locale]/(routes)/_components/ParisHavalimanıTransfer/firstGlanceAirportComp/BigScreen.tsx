"use client";
import React from "react";
import { motion } from "framer-motion";

// Define props interface
interface BigScreenProps {
  title: string;
  span: string;
}

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

const BigScreen = ({ title, span }: BigScreenProps) => {
  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        <div className="container hidden sm:flex flex-wrap justify-center items-center min-h-[275px] border-2 mx-auto my-10 relative h-[200px] bg-[url(/images/airportTerminal.webp)] bg-cover bg-cente rounded-xl shadow-xl brightness-100 dark:brightness-50 ">
          
          {/* Koyu Katman */}
          <div className="absolute inset-0 bg-black opacity-25"></div>

          {/* İçerik */}
          <div className="relative z-10 w-full sm:w-2/5 md:w-4/9 m-auto border-[#d7eae5] dark:border-[#067481] text-white">
            
            {/* Orta Kısım Animasyonlu */}
           
            
              <h1 className="text-xl sm:text-3xl text-center font-semibold tracking-[.15em] p-10 leading-relaxed">
                {title}
              </h1>
           
   

            {/* Clip-path için animasyon */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={clipPathVariants}
              className="absolute z-10 bottom-12 left-1/2 -translate-x-1/2 w-full h-5 bg-[#fece47]"
            ></motion.div>

            {/* Alt Yazı Animasyonlu */}
            <motion.div initial="hidden" animate="visible" custom={0.6} variants={textVariants}>
              <p className="text-center text-sm sm:text-xl font-extralight uppercase tracking-[.25em]">
                {span}
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default BigScreen