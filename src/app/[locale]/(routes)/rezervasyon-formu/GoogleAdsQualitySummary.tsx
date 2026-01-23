import React from 'react'

const GoogleAdsQualitySummary = () => {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 shadow-lg dark:border-emerald-900/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 dark:border-emerald-900/30">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white md:text-xl">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Paris Havalimanı Transfer Rezervasyon Özeti
          </h2>
        </div>
        <div className="p-6">
          <p className="mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
            Paris havalimanı transfer, Orly ve Charles de Gaulle havalimanı ile Paris şehir merkezi, Disneyland Paris ve Eyfel Kulesi bölgeleri arasında
            VIP transfer hizmeti için bu rezervasyon formunu kullanabilirsiniz.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            <li className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">
                <strong className="font-semibold text-emerald-700 dark:text-emerald-400">Paris VIP transfer</strong> – özel şoförlü, yeni ve konforlu araçlar
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">
                Toplu taşıma yerine hızlı ve konforlu <strong className="font-semibold text-emerald-700 dark:text-emerald-400">şehir merkezi ulaşım</strong> ve <strong className="font-semibold text-emerald-700 dark:text-emerald-400">Disneyland Paris ulaşım</strong>
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">
                Rezervasyon formunu doldurduktan sonra sizinle teyit amaçlı iletişime geçerek bilgi vereceğiz.
              </span>
            </li>
               <li className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">
                Sabit fiyatlı <strong className="font-semibold text-emerald-700 dark:text-emerald-400">Paris havalimanı transfer</strong> ve otel karşılama hizmeti
                Fiyatlarımız seçtiğiniz araç tipi ve güzergâha göre değişir; formu doldurduğunuzda size <strong className="font-semibold text-emerald-700 dark:text-emerald-400">net ve sabit bir transfer ücreti</strong> sunarız.
              </span>
            </li>
        
          </ul>
        </div>
      </div>
    </section>
  )
}

export default GoogleAdsQualitySummary

