import Link from 'next/link'
import React from 'react'
import { MdContactPhone, MdOutlineWhatsapp } from 'react-icons/md'

const CallToActionComponent = () => {
  return (
    <section className='my-20 bg-[#067481] dark:bg-black p-20'>

<div className="w-full p-4 text-center bg-white border border-[#d7eae5] rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Harekete Geçirici Başlık</h5>
    <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint architecto quaerat, accusamus alias necessitatibus beatae odit nam cum quod veritatis tempore corporis tempora ipsa vero voluptatem exercitationem laudantium hic eligendi.</p>
    <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <Link href="" className="w-full sm:w-auto bg-[#067481] hover:bg-[#067481] focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                <MdContactPhone className='min-w-16 text-3xl'/>
            <div className="text-left rtl:text-right">
            <div className=" font-sans text-xl font-semibold">Şimdi Ara!</div>
            </div>
        </Link>
        <a href="https://wa.me/905437214839?text=Merhabalar%20SetToBox%20web%20sitesinden%20iletişime%20geçiyorum.." className="w-full sm:w-auto bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                <MdOutlineWhatsapp className='min-w-16 text-3xl'/>
            <div className="text-left rtl:text-right">
        
                <div className="font-sans text-lg font-semibold">Whatsapp İletişim!</div>
            </div>
        </a>
    </div>
</div>


    </section>
  )
}

export default CallToActionComponent