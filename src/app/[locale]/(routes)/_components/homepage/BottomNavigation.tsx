"use client";

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdHome, MdMailOutline, MdOutlineWhatsapp } from 'react-icons/md'
import { WhatsAppBotProtection } from '@/src/components/WhatsAppBotProtection'

const BottomNavigation = () => {
    const t = useTranslations("BottomNavigation")
    const [showRecaptcha, setShowRecaptcha] = useState(false)
    
    const whatsappUrl = "https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20iletişime%20geçiyorum.."

    
  return (
    <div className='block sm:hidden static bottom-0 left-0'>



<div className="fixed bottom-0 left-0 z-1 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
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
        <Link href={t("span2Link")}>
        <button type="button" className="inline-flex flex-col items-center justify-center px-5 border-x border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600">
        <MdMailOutline className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"/>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{t("span2")}</span>
        </button>
        </Link>
        </div>
        
        <div className='flex w-1/3 justify-center'>
        <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("WhatsApp button clicked, opening modal...");
          setShowRecaptcha(true);
        }}
        className="inline-flex flex-col items-center justify-center border-x border-gray-200 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 animate-pulse"
        >
        <MdOutlineWhatsapp className="w-5 h-5 text-green-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500 rounded-lg animate-pulse-green" />

        <span className="text-sm text-green-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500">
            {t("span3")}
        </span>
        </button>
        </div>

     
    </div>
    </div>

    {showRecaptcha && (
      <>
        {console.log("Rendering WhatsAppBotProtection modal, showRecaptcha:", showRecaptcha)}
        <WhatsAppBotProtection
          whatsappUrl={whatsappUrl}
          onVerified={() => {}}
          onClose={() => {
            console.log("Closing modal...");
            setShowRecaptcha(false);
          }}
        />
      </>
    )}

    </div>
  )
}

export default BottomNavigation