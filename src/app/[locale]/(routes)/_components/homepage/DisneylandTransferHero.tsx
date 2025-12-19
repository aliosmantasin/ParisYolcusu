import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MdCheckCircle } from 'react-icons/md';
import Link from 'next/link';

const DisneylandTransferHero = () => {
  const t = useTranslations("DisneylandTransferHero");

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#067481] via-[#056a77] to-[#045a66] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sol Kolon - Metin İçeriği */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-xs uppercase tracking-widest text-white">
                {t("badge")}
              </span>
            </div>

            {/* Ana Başlık */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
            </h2>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-semibold mb-6">
              {t("tagline")}
            </p>

            {/* Açıklama */}
            <p className="text-lg leading-relaxed mb-8 text-white/90">
              {t("description")}
            </p>

            {/* Özellikler Listesi */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <MdCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Call-to-Action Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={t("ctaLink")}
                className="inline-flex items-center justify-center bg-white text-[#067481] font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
              >
                {t("ctaButton")} →
              </Link>
              <Link
                href={t("helpLink")}
                className="inline-flex items-center justify-center text-white hover:text-gray-200 transition-colors"
              >
                {t("helpLinkText")} →
              </Link>
            </div>
          </div>

          {/* Sağ Kolon - Görsel Kartı */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Görsel */}
              <div className="relative w-full h-64 md:h-80 lg:h-96">
                <Image
                  src="/images/DisneylandAile.webp"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Kart İçi Bilgiler */}
              <div className="p-6 space-y-4">
                {/* Travel Time */}
                <div className="flex justify-between items-center text-white text-sm">
                  <span className="uppercase tracking-wider">{t("travelTimeLabel")}</span>
                  <span className="font-semibold">{t("travelTime")}</span>
                </div>

                {/* Vehicle Classes */}
                <div className="flex justify-between items-center text-white text-sm">
                  <span className="uppercase tracking-wider">{t("vehicleClassesLabel")}</span>
                  <span className="font-semibold">{t("vehicleClasses")}</span>
                </div>

                {/* Trust Message */}
                <p className="text-white/90 text-sm pt-4 border-t border-white/20">
                  {t("trustMessage")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisneylandTransferHero;


