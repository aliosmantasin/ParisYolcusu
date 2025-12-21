"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const VipTransferParisHero = () => {
  const t = useTranslations("VipTransferParis.hero");

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sol Kolon - Ana İçerik */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("title")}
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                {t("description1")}
              </p>
              <p className="text-lg leading-relaxed">
                {t.raw("description2") ? (
                  <span dangerouslySetInnerHTML={{ __html: t.raw("description2") as string }} />
                ) : (
                  t("description2")
                )}
              </p>
            </div>
          </div>

          {/* Sağ Kolon - Bilgi Kartı */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Transfer Rates Başlığı */}
              <div className="px-6 pt-6">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  {t("transferRates")}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">€</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("transferTitle")}
                  </h3>
                </div>
              </div>

              {/* Fiyatlandırma Bilgisi */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("pricingInfo")}
                </p>
              </div>

              {/* Pre-book Guarantee Bölümü */}
              <div className="px-6 py-6 bg-[#067481] dark:bg-[#067481]/90 text-white">
                <h4 className="font-bold text-lg mb-2">
                  {t("guaranteeTitle")}
                </h4>
                <p className="text-sm text-white/90">
                  {t("guaranteeDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipTransferParisHero;