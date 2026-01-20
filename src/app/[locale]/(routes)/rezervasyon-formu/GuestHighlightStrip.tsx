'use client'

import React from 'react'
import Image from 'next/image'

const GuestHighlightStrip = () => {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    const target = document.getElementById('customer-reviews')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-2xl px-4 m-2">
      <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4 shadow-lg ring-1 ring-emerald-100 dark:from-slate-900 dark:to-slate-800 dark:ring-emerald-900/30 md:p-6">
        <div className="mb-3 flex -space-x-4">
          <div className="h-14 w-14 overflow-hidden rounded-full border-3 border-white shadow-md ring-2 ring-emerald-500/70 transition-transform hover:scale-110 hover:ring-emerald-500 md:h-16 md:w-16">
            <Image
              src="/images/misafir/parisgezi2.webp"
              alt="Misafirlerimizle Eyfel Kulesi turu"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-14 w-14 overflow-hidden rounded-full border-3 border-white shadow-md ring-2 ring-emerald-500/50 transition-transform hover:scale-110 hover:ring-emerald-500 md:h-16 md:w-16">
            <Image
              src="/images/misafir/misafir1.webp"
              alt="Paris havalimanı transfer misafir karşılama"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-14 w-14 overflow-hidden rounded-full border-3 border-white shadow-md ring-2 ring-emerald-500/50 transition-transform hover:scale-110 hover:ring-emerald-500 md:h-16 md:w-16">
            <Image
              src="/images/misafir/misafir2.webp"
              alt="Paris VIP araç ile yolculuk eden misafir"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="mb-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300 md:text-sm">
          Gerçek misafirlerimizin deneyimlerini görün
        </p>

        <button
          type="button"
          onClick={handleClick}
          className="group relative inline-flex animate-pulse items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-500/50 transition-all hover:scale-105 hover:animate-none hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/60 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 md:px-6 md:py-3 md:text-sm"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" aria-hidden="true" />
        <svg
          className="relative h-4 w-4 transition-transform group-hover:rotate-12 md:h-5 md:w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="relative">
          Misafir Deneyimlerini İncele
        </span>
        <svg
          className="relative h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </div>
    </div>
  )
}

export default GuestHighlightStrip
