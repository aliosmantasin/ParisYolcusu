import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import { MdHome, MdOutlinePhoneInTalk, MdOutlineWhatsapp } from 'react-icons/md'

const BottomNavigation = () => {
    const t = useTranslations("BottomNavigation")

    
  return (
    <div className='block sm:hidden static bottom-0 left-0'>



<div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
    <div className="flex justify-between h-full max-w-lg  mx-auto font-medium p-3 ">

        <div className='flex w-1/3 justify-center'>
        <Link href="/">
        <button type="button" className="inline-flex flex-col items-center justify-center px-4 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600">
        <MdHome className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"/>
            
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("span1")}</span>
        </button>
        </Link>
        </div>
     
        <div className='flex w-1/3 justify-center'>
        <Link href="tel:+33651150547">
        <button type="button" className="inline-flex flex-col items-center justify-center px-5 border-x border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600">
        <MdOutlinePhoneInTalk className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"/>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("span2")}</span>
        </button>
        </Link>
        </div>
        
        <div className='flex w-1/3 justify-center'>
        <Link href="https://wa.me/33651150547?text=Merhabalar%Paris%20Yolcusu%20web%20sitesinden%20iletişime%20geçiyorum..">
        <button type="button" className="inline-flex flex-col items-center justify-center border-x border-gray-200 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <MdOutlineWhatsapp className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"/>

            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("span3")}</span>
        </button>
        </Link>
        </div>

        {/* <Link href="https://www.google.com/maps/dir//Salk%C4%B1m+Evler,+07600+Manavgat%2FAntalya/@36.7920371,31.4283517,13.35z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14c357250fdef3d9:0x7121834adf9aa494!2m2!1d31.4667035!2d36.7974025?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D">
        <button type="button" className="inline-flex flex-col items-center justify-center px-2 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group border-x dark:border-gray-600">
        <MdLocationOn className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"/>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Konum</span>
        </button>
        </Link> */}
    </div>
</div>


    </div>
  )
}

export default BottomNavigation