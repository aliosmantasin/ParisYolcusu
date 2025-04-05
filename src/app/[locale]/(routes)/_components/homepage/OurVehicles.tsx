import { Button } from '@/components/ui/button';
import { BaggageClaim } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { MdArrowForwardIos, MdOutlineFamilyRestroom } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const OurVehicles = () => {
  const t = useTranslations("OurVehicles");

  const vehicles = [
    {
      id: 1,
      name: t("vehicle1.name"),
      description: t("vehicle1.description"),
      image: "/images/carPalholder.webp",
      capacity: "3",
      link: "/rezervasyon-formu?vehicle=mercedes-benz-classe-e"
    },
    {
      id: 2,
      name: t("vehicle2.name"),
      description: t("vehicle2.description"),
      image: "/images/MercedesBenzClasseV.png",
      capacity: "7",
      link: "/rezervasyon-formu?vehicle=mercedes-benz-classe-v"
    },
    {
      id: 3,
      name: t("vehicle3.name"),
      description: t("vehicle3.description"),
      image: "/images/MercedesBenzClasseS.png",
      capacity: "3",
      link: "/rezervasyon-formu?vehicle=mercedes-benz-classe-s"
    }
  ];

  return (
    <section className='bg-slate-50 dark:bg-black my-20'>
      <div className='container mx-auto p-5'>
        <div className='max-w-lg flex justify-center mx-auto'>
          <div>
            <h3 className='my-4 text-4xl primary dark:text-slate-400 text-center tracking-widest'>{t("title")}</h3>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <p className='mb-6 text-lg paragraphStyle text-center'>{t("description")}</p>
          </div>
        </div>
                
        <div className='max-w-7xl block sm:flex gap-10 sm:overflow-x-auto sm:scrollbar-custom pb-5 mx-0 sm:mx-auto'>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className='w-full sm:w-1/2 lg:w-2/7 cursor-pointer'>
              <div className='mb-3 sm:mb-0 cardBgColor cardHover max-w-md flex justify-center bg-slate-50 dark:bg-black min-h-[450px]'>
                <div className='mx-auto p-10'>
                  <span className='paragraphStyle text-2xl font-semibold text-center my-4 flex justify-center'>{vehicle.name}</span>
                  <div className='paragraphStyle font-semibold text-center my-4 flex justify-center'>
                    <span className='flex items-center'>
                      <MdOutlineFamilyRestroom className='text-2xl mx-2 m-auto'/> 
                      <span className='m-auto'>{vehicle.capacity} {t("passengers")}</span>
                    </span>
                    <span className='flex items-center'>
                      <BaggageClaim className='text-2xl mx-2 m-auto'/> 
                      <span className='m-auto'>{vehicle.capacity === "7" ? "7" : "2"} {t("luggage")}</span>
                    </span>
                  </div>
                  <div className='min-h-[200px]'>
                    <Image src={vehicle.image} alt={vehicle.name} width={400} height={400} />
                  </div>
                  <div className='flex justify-center mt-5'>
                    <Link href={vehicle.link}>
                      <Button variant="outline" className='w-[300px]'>
                        {t("reserve_now")} <MdArrowForwardIos/>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurVehicles;
