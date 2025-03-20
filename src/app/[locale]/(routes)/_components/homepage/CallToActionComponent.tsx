import Link from 'next/link'
import React from 'react'
import { MdOutlineWhatsapp } from 'react-icons/md'
import { useTranslations } from 'next-intl'

const CallToActionComponent = () => {
  const t = useTranslations("CallToAction");

  return (
    <section className='my-20 bg-[#067481] dark:bg-black p-20'>

      <div className="w-full p-4 text-center bg-white border border-[#d7eae5] rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h5>
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
          {t("description")}
        </p>

        <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
          <Link href="https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20iletişime%20geçiyorum.." 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 animate-pulse">
            <MdOutlineWhatsapp className='mx-2 text-3xl'/>
            <div className="text-left rtl:text-right">
              <div className="font-sans text-lg font-semibold">{t("whatsapp")}</div>
            </div>
          </Link>
        </div>
      </div>

    </section>
  )
}

export default CallToActionComponent
