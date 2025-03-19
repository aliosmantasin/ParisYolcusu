

import React from 'react'
import FirstGlanceSvgLeft from '../lib/_svgComponent/FirstGlanceSvgLeft'
import FirstGlanceSvgRight from '../lib/_svgComponent/FirstGlanceSvgRight'
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";



const FirstGlance = () => {
  return (
    <section className='w-full  bg-[#ffffff] dark:bg-black relative p-15'>
       <div className='min-h-[60vh] mx-10 flex flex-col border-2 border-[#d7eae5] dark:border-[#067481] place-content-center'>

        <div className='absolute top-0 left-0 z-10 sm:w-[18%] '>

            <FirstGlanceSvgLeft/>

        </div>

        <div>
        <p className='text-center text-xl font-semibold uppercase tracking-[.15em] primary'>Marka</p>
        <p className='text-center text-md font-semibold uppercase tracking-[.15em] primary'>İsmİ</p>
        </div>


        <div className="flex items-center justify-center relative">
          <MdOutlineArrowLeft className="mr-1 text-4xl min-w-8" />
          <h1 className="relative text-4xl text-center font-semibold uppercase tracking-[.15em] p-10">
            <span className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-full h-5 bg-[#fece47] 
                   [clip-path:polygon(5%_0%,100%-45%,95%_95%,55%_50%)]">
            </span>
            Buraya Başlık Girilecek
          </h1>
          <MdOutlineArrowRight className="ml-1 text-4xl min-w-8" />
        </div>

      <div>
        <p className='text-center text-xl font-extralight uppercase tracking-[.25em]'>Kurucu İSMİ</p>
      </div>

      <div className='absolute bottom-0 right-0 z-10 sm:w-[18%]'>

            <FirstGlanceSvgRight/>

        </div>

       </div>
    </section>
  )
}

export default FirstGlance