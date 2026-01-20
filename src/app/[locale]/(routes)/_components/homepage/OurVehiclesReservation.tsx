import Image from 'next/image'
import React from 'react'
import { MdOutlineFamilyRestroom } from 'react-icons/md'
import { BaggageClaim } from 'lucide-react'
import { useTranslations } from 'next-intl'

const OurVehiclesReservation = () => {
  const t = useTranslations('OurVehicles')

  const vehicles = [
    {
      id: 1,
      name: t('vehicle1.name'),
      description: t('vehicle1.description'),
      image: '/images/teslaModelY.webp',
      capacity: '3',
    },
    {
      id: 2,
      name: t('vehicle2.name'),
      description: t('vehicle2.description'),
      image: '/images/MercedesBenzClasseV.png',
      capacity: '7',
    },
    {
      id: 3,
      name: t('vehicle3.name'),
      description: t('vehicle3.description'),
      image: '/images/MercedesBenzClasseS.png',
      capacity: '3',
    },
  ]

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16 dark:from-black dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {t('title')}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Konforlu Araç Filosu
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <p className="text-slate-600 dark:text-slate-400">{t('description')}</p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl ring-1 ring-slate-200 transition-all hover:scale-[1.02] hover:shadow-2xl hover:ring-emerald-500 dark:from-slate-900 dark:to-slate-800 dark:ring-slate-700 dark:hover:ring-emerald-500"
            >
              <div className="relative">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  Premium
                </div>
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    width={500}
                    height={300}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                  {vehicle.name}
                </h3>

                <div className="mb-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
                    <MdOutlineFamilyRestroom className="text-2xl text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {vehicle.capacity} {t('passengers')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
                    <BaggageClaim className="text-2xl text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {vehicle.capacity === '7' ? '7' : '2'} {t('luggage')}
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {vehicle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurVehiclesReservation
