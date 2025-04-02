import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

const CleanCar = () => {

    const t = useTranslations("CleanCar")

    return (
        <section className='my-20 py-10'>
            <div className='container flex flex-wrap mx-auto justify-center items-center'>

                <div className='flex p-2 w-full sm:w-2/4 md:w-6/12'>
                    <Image src="/images/clean-car.jpg" alt='Transfer Sonrası Temizlik' width={500} height={500} className='object-contain mx-auto'></Image>
                </div>

                <div className=' p-2 w-full sm:w-2/4 md:w-5/12'>

                        <div className='w-full text-xl font-semibold p-2 primary'>
                            <h2>{t("title")}</h2>
                        </div>

                    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p1")}</span>
                        </li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p2")}</span>
                        </li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p3")}</span>
                        </li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p4")}</span>
                        </li>
                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p5")}</span>
                        </li>

                        <li className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                            <span>{t("p6")}</span>
                        </li>
                    </ul>

                </div>

            </div>

        </section>
    )
}

export default CleanCar