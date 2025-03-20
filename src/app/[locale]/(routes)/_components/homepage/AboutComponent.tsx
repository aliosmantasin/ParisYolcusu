import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

const AboutComponent = () => {
  const t = useTranslations("AboutUs");

  return (
    <section className='my-10 p-5' id='about'>
      <div className='container flex flex-wrap mx-auto'>

        {/* Başlık */}
        <div className='w-full text-center p-2'>
          <h2 className='text-[#067481] font-bold text-3xl my-3'>{t("title")}</h2>
        </div>

        {/* Görsel Alanı */}
        <div className='flex w-full sm:w-3/5 md:w-6/12 justify-center relative mx-auto'>
          <div className='absolute hidden xl:flex sm:w-[500] sm:h-[500]   bg-[#fece47] rounded-full z-0 top-0'></div>
          <Image 
            src="/images/paris-yolcusu.webp" 
            alt='Paris Yolcusu' 
            width={500} 
            height={500} 
            className='relative w-300 sm:w-[350] md:w-auto md-h-auto z-10 rounded-xl shadow-lg object-contain '
          />
          <div className='absolute hidden xl:flex sm:w-[500] sm:h-[500] bg-[#067481] rounded-full z-0 bottom-0'></div>
        </div>

        {/* Açıklama Alanı */}
        <div className='flex w-full sm:w-3/5 md:w-6/12 justify-center mx-auto'>
          <div className='m-auto p-5'>
            <p className='my-2 text-xl font-medium text-gray-500 dark:text-gray-400'>{t("description")}</p>

            {/* Öne Çıkan Hizmetler */}
            <ul className="space-y-4 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li><strong>{t("feature1.title")}</strong>: {t("feature1.description")}</li>
              <li><strong>{t("feature2.title")}</strong>: {t("feature2.description")}</li>
              <li><strong>{t("feature3.title")}</strong>: {t("feature3.description")}</li>
              <li><strong>{t("feature4.title")}</strong>: {t("feature4.description")}</li>
              <li><strong>{t("feature5.title")}</strong>: {t("feature5.description")}</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutComponent;
