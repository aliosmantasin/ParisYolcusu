import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ParisAirportTransfer() {
  const t = useTranslations("ParisAirportTransfer");

  const airports = [
    {
      name: t("cdg.name"),
      description: t("cdg.description"),
      image: '/images/cdgCart.webp'
    },
    {
      name: t("ory.name"),
      description: t("ory.description"),
      image: '/images/orlycart.webp'
    },
    {
      name: t("bva.name"),
      description: t("bva.description"),
      image: '/images/bvacart.webp'
    }
  ];

  return (
    <section className="my-20 py-10 bg-slate-50 dark:bg-black ">
        
        <div>
        <h2 className="text-3xl primary text-center mb-6">{t("title")}</h2>
          <p className="text-lg text-center max-w-2xl mx-auto mb-10 paragraphStyle">
          {t.rich("description", {
         strong: (chunks) => <Link href={t("linkAirport")} className='underline'>{chunks}</Link>
         })}
          </p>
        </div>

        <div className='container flex flex-wrap mx-auto gap-10 justify-center'>
          {airports.map((airport, index) => (
            <div key={index} className= "max-w-sm cardBgColor cardHover shadow-lg rounded-lg overflow-hidden cursor-pointer">
              <Image 
                src={airport.image} 
                alt={airport.name} 
                width={400} 
                height={250} 
                className="w-full h-56 object-cover" 
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold HeadStyle">{airport.name}</h3>
                <p className="paragraphStyle mt-2">{airport.description}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}
