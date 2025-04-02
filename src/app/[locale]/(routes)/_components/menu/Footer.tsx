"use client"
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from "next-themes";
import React from 'react'

const Footer = () => {
    const t = useTranslations("Footer");
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;
  
    const logoSrc = currentTheme === "dark" 
      ? "/images/ParisYolcusuLogoBeyaz.png" 
      : "/images/ParisYolcusuLogo.png";
  
    return (
<section className='my-10'> 
<footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4 mb-20">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
        <Link href="/">
        <Image src={logoSrc} alt="Paris Yolcusu Logo" width={150} height={150}/>
      </Link>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                
                <li>
                    <Link href="https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20ileti%C5%9Fime%20ge%C3%A7iyorum.."  className="hover:underline me-4 md:me-6">{t("contact")}</Link>
                </li>

                <li>
                    <a href="#about" className="hover:underline me-4 md:me-6">{t("about")}</a>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="https://flowbite.com/" className="hover:underline primary">Paris Yolcusu | </a>{t("span")}</span>
    </div>

    <div className='w-full flex justify-center'>
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d165616.78415363794!2d2.311549575172532!3d49.03684106683648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1743419238398!5m2!1sen!2str"
     width="1400px"
     height="100"
     style={{maxWidth:"1400"}}
     loading="lazy"
     referrerPolicy="no-referrer-when-downgrade">
     </iframe>
    </div>
</footer>
</section>
  )
}

export default Footer
