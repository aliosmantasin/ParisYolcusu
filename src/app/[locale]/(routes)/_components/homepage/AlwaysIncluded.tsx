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
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        {/* Ana Kart Container */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">
              {t("preHeader")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
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
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex gap-4 items-start"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlwaysIncluded;
