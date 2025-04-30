import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FeaturesBrand = () => {
  const t = useTranslations("FeaturesBrand");

  const features = [
    {
      img: "",
      title: t("feature1.title"),
      description1: t("feature1.description1"),
      description2: t("feature1.description2")
    },
    {
      img: "",
      title: t("feature2.title"),
      description1: t("feature2.description1"),
      description2: t("feature2.description2")
    },
    {
      img: "",
      title: t("feature3.title"),
      description1: t("feature3.description1"),
      description2: t("feature3.description2")
    },
    {
      img: "",
      title: t("feature4.title"),
      description1: t("feature4.description1"),
      description2: t("feature4.description2")
    },
    {
      img: "",
      title: t("feature5.title"),
      description1: t("feature5.description1"),
      description2: t("feature5.description2")
    },
    {
      img: "",
      title: t("feature6.title"),
      description1: t("feature6.description1"),
      description2: t("feature6.description2")
    },
    {
      img: "",
      title: t("feature7.title"),
      description1: t("feature7.description1"),
      description2: t("feature7.description2")
    },
  ];

  return (
    <section className="py-10 px-4">
      <div className="container flex flex-wrap mx-auto">
        
        {/* Görsel Alanı */}
        <div className="flex w-full sm:w-3/5 md:w-5/12 items-center justify-center mx-auto mb-10 sm:mb-0">


        <div className='relative'>

          {/* Üst Sarı Blur Daire */}
          <div className="absolute bg-[#fece47] rounded-full blur-2xl animate-pulse z-0 
            w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] 
            top-0 left-10 sm:left-36">
          </div>

          {/* Görsel */}
          <Image 
            src="/images/features.webp" 
            alt="Paris Yolcusu" 
            width={600} 
            height={350} 
            className="w-[350px] sm:w-[350px] md:w-[400px] lg:w-[500px] 
              relative rounded-xl "
          />

          {/* Alt Mavi Blur Daire */}
          <div className="absolute bg-[#067481] rounded-full blur-2xl animate-pulse z-0 
            w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] 
            bottom-0 right-10 sm:right-36">
          </div>
        </div>



        </div>

        {/* Açılır Alan */}
        <div className="flex flex-col w-full sm:w-3/5 md:w-5/12 mx-auto">
          <h2 className="text-[#067481] text-3xl mb-6">{t("title")}</h2>
          <Accordion type="single" collapsible>
            {features.map((feature, index) => (
              <AccordionItem key={index} value={`feature-${index}`}>
                <AccordionTrigger className="text-lg font-semibold HeadStyle">
                  {feature.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="paragraphStyle">{feature.description1}</p>
                  <p className="paragraphStyle">{feature.description2}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
};

export default FeaturesBrand;
