import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

const AboutComponent = () => {
  const t = useTranslations("AboutUs");

  return (
    <section className='my-10 p-5 relative' id='about'>
      <div className='container flex flex-wrap mx-auto relative'>

        {/* Görsel Alanı */}
        <div className='flex w-full sm:w-4/5 lg:w-6/12 justify-center mx-auto'>

          <div className='relative flex justify-center items-center p-10 sm:max-h-[600px] lg:max-h-[600px]'>

            {/* Üst Sarı Daire */}
            <div className='absolute bg-[#fece47] rounded-full z-[-1] 
              w-[250px] h-[250px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]  
           top-0 lg:top-10'>
            </div>

            {/* Görsel */}
            <Image 
              src="/images/paris-yolcusu.webp" 
              alt='Paris Yolcusu' 
              width={600} 
              height={300} 
              layout='intrinsic' 
              className='relative rounded-xl object-contain'
            />

            {/* Alt Mavi Daire */}
            <div className='absolute bg-[#067481] rounded-full z-[-1] 
              w-[250px] h-[250px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] 
              bottom-0 lg:bottom-10'>
            </div>

          </div>
        </div>

        {/* Açıklama Alanı */}
        <div className='flex w-full sm:w-4/5 lg:w-5/12 justify-center mx-auto'>
                
        {/* Başlık */}
     

          <div className='m-auto p-5'>
          <div className='w-full text-center p-2'>
          <h2 className='text-[#067481] text-start font-bold text-3xl my-3'>{t("title")}</h2>
        </div>
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
