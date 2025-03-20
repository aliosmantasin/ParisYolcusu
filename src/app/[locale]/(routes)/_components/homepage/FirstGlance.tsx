

import React from 'react'
// import FirstGlanceSvgLeft from '../lib/_svgComponent/FirstGlanceSvgLeft'
// import FirstGlanceSvgRight from '../lib/_svgComponent/FirstGlanceSvgRight'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { useTranslations } from 'next-intl';
import Image from 'next/image';




const FirstGlance = () => {

  const t = useTranslations("HomePage")



  return (
    <section className='w-full  bg-[#ffffff] dark:bg-black relative'>
       <div className='container flex flex-wrap justify-center items-center min-h-[60vh] border-2 mx-auto my-10'>

        {/* <div className='absolute top-0 left-0 z-10 sm:w-[20%]'>
            <FirstGlanceSvgLeft/>
        </div> */}

        <div className='w-full sm:w-2/5 md:w-4/9 m-auto border-[#d7eae5] dark:border-[#067481] '>

        <div>
        <p className='text-center  text-md sm:text-xl font-semibold uppercase tracking-[.15em] primary'>{t("firstGlance.brandNameX")}</p>
        <p className='text-center  text-sm sm:text-md font-semibold uppercase tracking-[.15em] primary'>{t("firstGlance.brandnameY")}</p>
        </div>

        <div className="flex items-center justify-center relative">
          <MdOutlineArrowLeft className="mr-1 text-4xl min-w-8" />
          <h1 className="text-xl sm:text-3xl text-center font-semibold  tracking-[.10em] p-10 leading-relaxed">
          {t("firstGlance.title")}
          <span className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-full h-5 bg-[#fece47] 
                   [clip-path:polygon(5%_0%,100%-45%,95%_95%,55%_50%)]">
            </span>
          </h1>
         
          <MdOutlineArrowRight className="ml-1 text-4xl min-w-8" />
        </div>
      <div>
        <p className='text-center text-sm sm:text-xl font-extralight uppercase tracking-[.25em]'>{t("firstGlance.span")}</p>
      </div>

     
      </div>

      <div className='hidden sm:flex w-full sm:w-2/5 md:w-5/9 m-auto borders'>
        <Image src="/images/bannerNew.png" className='w-auto h-auto  sm:w-[400] md:w-[600] md:max-h-[600] m-auto' width={500} height={500} alt=''/>
      </div>

        {/* <div className='absolute bottom-0 right-0 z-10 sm:w-[18%]'>
          <FirstGlanceSvgRight />
        </div> */}

       </div>
    </section>
  )
}

export default FirstGlance