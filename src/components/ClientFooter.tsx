"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { useTheme } from "next-themes";
import { useCookieConsent } from '../context/CookieConsentContext'
import { MdCookie } from 'react-icons/md';

interface ClientFooterProps {
  locale: string;
  translations: {
    contact: string;
    about: string;
    cookiePolicy: string;
    cookiePolicyUrl: string;
    span: string;
  }
}

const ClientFooter = ({ locale, translations }: ClientFooterProps) => {
  const { showPreferences } = useCookieConsent();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  
  const logoSrc = currentTheme === "dark" 
    ? "/images/ParisYolcusuLogoBeyaz.png" 
    : "/images/ParisYolcusuLogo.png";

  return (
    <section className='my-10'> 
      <footer>
          <div className="container mx-auto p-4 md:py-8 bg-red-500">
              <div className=" block sm:flex justify-between">
                <Link href={`/${locale}`}>
                  <Image src={logoSrc} alt="Paris Yolcusu Logo" width={150} height={150}/>
                </Link>
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    
                    <li>
                        <Link href="https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20ileti%C5%9Fime%20ge%C3%A7iyorum.."  className="hover:underline mx-2 md:me-6">{translations.contact}</Link>
                    </li>

                    <li>
                        <a href="#about" className="hover:underline mx-2 md:me-6">{translations.about}</a>
                    </li>
                    
                    <li>
                        <Link href={`/${locale}${translations.cookiePolicyUrl}`} className="hover:underline mx-2 md:me-6">{translations.cookiePolicy}</Link>
                    </li>
                    
                    <li>
                    <button 
                      onClick={showPreferences}
                      className="text-sm hover:underline"
                    >
                      <MdCookie className='text-3xl'/>
                    </button>
                    </li>
                </ul>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
              <div className="text-sm text-gray-500 sm:text-center dark:text-gray-400 text-center my-2">
                <span className="block">© 2025 <a href="http://parisyolcusu.com/" className="hover:underline primary">Paris Yolcusu | </a>{translations.span}</span>
                <span className="block mt-2">Website by <a href="http://settobox.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#067481]">Settobox Digital Marketing</a></span>
              </div>
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

export default ClientFooter 