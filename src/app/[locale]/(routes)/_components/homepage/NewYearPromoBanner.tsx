"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';

const NewYearPromoBanner = () => {
  const t = useTranslations("NewYearPromo");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // localStorage'dan kontrol et - kullanıcı kapatmış mı?
    const isDismissed = localStorage.getItem('newYearPromoDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newYearPromoDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-30 w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* İndirim İkonu ve Metin */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl animate-pulse">🎄</span>
                <span className="text-sm sm:text-base font-bold">{t("discountTitle")}</span>
              </div>

              {/* Erken Rezervasyon Uyarısı */}
              <div className="flex items-center gap-2 sm:gap-3 border-l border-white/30 pl-3 sm:pl-4">
                
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left">
                  {t("earlyReservationWarning")}
                </span>
              </div>

              {/* Kapat Butonu */}
              <button
                onClick={handleClose}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close"
              >
                <MdClose className="text-xl sm:text-2xl" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewYearPromoBanner;
