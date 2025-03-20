import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  
      <div className="container flex flex-wrap mx-auto ">
        
      <div className='w-full flex w-150 sm:w-3/5 md:w-5/12 item-center justify-center mx-auto mb-0 sm:mb-10 relative'>
    

      <div className='absolute sm:w-[250] sm:h-[250] bg-[#fece47] rounded-full z-0 top-0 left-36 blur-2xl animate-pulse'></div>

                <Image 
                  src="/images/features.webp" 
                  alt="Paris Yolcusu" 
                  width={500} 
                  height={500} 
                  className="mx-atuo w-[350] mb-5 sm:w-auto relative z-10 rounded-xl shadow-lg"
                />
     
     <div className='absolute sm:w-[250] sm:h-[250] bg-[#067481] rounded-full z-0 bottom-0 right-36 blur-2xl animate-pulse'></div>
       
      </div>
      

        {/* Açılır Alan */}
        <div className="flexw-full sm:w-3/5 md:w-5/12 mx-auto">
        <h2 className="text-[#067481] font-bold text-3xl mb-6">{t("title")}</h2>
          <Accordion type="single" collapsible>
            {features.map((feature, index) => (
              <AccordionItem key={index} value={`feature-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-gray-700">
                  {feature.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{feature.description1}</p>
                  <p className="text-gray-500">{feature.description2}</p>
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
