import Image from 'next/image';
import React from 'react'

const Services = () => {

    const features = [
        {
          title: "Lorem ipsum dolor sit amet.",
          description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta impedit voluptatibus distinctio nam iusto ipsam?",
          url:"/hizmet-sayfasi1",
          apply:"/basvuru-yap"
        },
        {
          title: "Lorem ipsum dolor sit amet.",
          description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta impedit voluptatibus distinctio nam iusto ipsam?",
          url:"/hizmet-sayfasi2",
          apply:"/basvuru-yap"
          
        },
        {
          title: "Lorem ipsum dolor sit amet.",
          description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta impedit voluptatibus distinctio nam iusto ipsam?",
          url:"/hizmet-sayfasi3",
          apply:"/basvuru-yap"
        }
      ];

      
      
  return (
    <section className='py-10 my-10 bg-slate-50 dark:bg-black relative' id='hizmetlerimiz'>
        <div className='container flex flex-wrap justify-between gap-10  mx-auto'>
            
            <div className='w-full flex justify-center items-center my-5 text-center'>
                <div>
                  <h2 className='font-bold text-3xl primary'>Hizmet Bölümü</h2>
                  <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe neque magnam necessitatibus mollitia maiores voluptate.</p>
                </div>
            </div>

            {features.map((feature, index) => (
             <div key={index} className="w-full max-w-sm bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto p-3">
             
             <div className="flex flex-col items-center pb-10">
                 <Image className='w-32 h-32 mb-3 rounded-full shadow-lg p-2 border border-[#fece47]' src="/images/placeholder1.png" alt='gorsel1' width={200} height={200} />

                 <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{feature.title}</h5>
                 <span className="text-sm text-center text-gray-500 dark:text-gray-400">{feature.description}</span>
                 
                  <div className="flex mt-4 md:mt-6">
                    <a href={feature.url} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Daha Fazla Bilgi</a>
                    <a href={feature.apply} className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Başvuru Yap</a>
                  </div>
             </div>
         </div>
        ))}
           
        </div>
    </section>
  )
}

export default Services
