import React from 'react';
import { useTranslations } from 'next-intl';
import { MdChildCare, MdLuggage, MdPerson, MdEuro, MdPhone, MdEdit } from 'react-icons/md';

const AlwaysIncluded = () => {
  const t = useTranslations("AlwaysIncluded");

  const features = [
    {
      icon: MdChildCare,
      title: t("feature1.title"),
      description: t("feature1.description"),
    },
    {
      icon: MdLuggage,
      title: t("feature2.title"),
      description: t("feature2.description"),
    },
    {
      icon: MdPerson,
      title: t("feature3.title"),
      description: t("feature3.description"),
    },
    {
      icon: MdEuro,
      title: t("feature4.title"),
      description: t("feature4.description"),
    },
    {
      icon: MdPhone,
      title: t("feature5.title"),
      description: t("feature5.description"),
    },
    {
      icon: MdEdit,
      title: t("feature6.title"),
      description: t("feature6.description"),
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4 dark:from-slate-950 dark:to-black">
      <div className="container mx-auto max-w-6xl">
        {/* Ana Kart Container */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-2xl ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-800 dark:ring-slate-700">
          <div className="p-8 md:p-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("preHeader")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {t("title")}
              </h2>
              <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t("subtitle")}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white p-6 shadow-lg ring-1 ring-slate-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:ring-emerald-500 dark:from-slate-800 dark:to-slate-900 dark:ring-slate-700 dark:hover:ring-emerald-500"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                      <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlwaysIncluded;
