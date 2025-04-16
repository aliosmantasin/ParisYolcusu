import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react'

const Services = () => {

  const t = useTranslations("Services")

    const features = [
  {
    img1: "/images/transfer-paris.webp",
    title: t("subtitle1"),
    description: t("p1"),
    moreInfoText: t("moreInfo1"),
    moreInfoUrl: t("moreInfoLink1"),
    applyButtonText: t("detailedReview"),
    applyButtonLink: t("detailedReviewLink"),
  },
  {
    img1: "/images/paris-travel.webp",
    title: t("subtitle2"),
    description: t("p2"),
    moreInfoText: t("moreInfo2"),
    moreInfoUrl: t("moreInfoLink2"),
    applyButtonText: t("reservationButton2"),
    applyButtonLink: t("reservationForm2"),
  },
  {
    img1: "/images/location-to-location-paris.webp",
    title: t("subtitle3"),
    description: t("p3"),
    moreInfoText: t("moreInfo3"),
    moreInfoUrl: t("moreInfoLink3"),
    applyButtonText: null,
    applyButtonLink: null,
  },
  {
    img1: "/images/disneyland.webp",
    title: t("subtitle4"),
    description: t("p4"),
    moreInfoText: t("moreInfo4"),
    moreInfoUrl: t("moreInfoLink4"),
    applyButtonText: null,
    applyButtonLink: null,
  }
];
      
      
  return (
    <section className='relative my-20' id='hizmetlerimiz'>
        <div className='container flex flex-wrap justify-between gap-10  mx-auto'>
            
            <div className='w-full flex justify-center items-center my-5 text-center'>
                <div>
                  <h2 className='text-3xl primary'>{t("title")}</h2>
                  <p className='paragraphStyle'>{t("description")}</p>
                </div>
            </div>

            {features.map((feature, index) => (
             <div key={index} className="w-full max-w-sm bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto p-2 ">
             
             <div className="flex flex-col items-center pb-10">
                 <Image className='w-24 h-24 mb-3 rounded-xl shadow-lg p-2 border border-[#fece47] object-contain' src={feature.img1 ?? "/images/default-image.jpg"} alt='gorsel1' width={200} height={200} />

                 <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">{feature.title}</h5>
                 <span className="text-sm text-center text-gray-500 dark:text-gray-400">{feature.description}</span>
                 
                  <div className="flex mt-4 md:mt-6">
                    {feature.moreInfoUrl && (
                      <a href={feature.moreInfoUrl} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{feature.moreInfoText}</a>
                    )}
                    {feature.applyButtonLink && (
                      <a href={feature.applyButtonLink} className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{feature.applyButtonText}</a>
                    )}
                  </div>
             </div>
         </div>
        ))}
           
        </div>
    </section>
  )
}

export default Services
