"use client"
import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const RelatedTransfers = () => {
  const t = useTranslations("RelatedTransfers");
  const locale = useLocale();

  const transfers = [
    {
      title: t("transfers.transfer1.title"),
      link: t("transfers.transfer1.link")
    },
    {
      title: t("transfers.transfer2.title"),
      link: t("transfers.transfer2.link")
    },
    {
      title: t("transfers.transfer3.title"),
      link: t("transfers.transfer3.link")
    },
    {
      title: t("transfers.transfer4.title"),
      link: t("transfers.transfer4.link")
    },
    {
      title: t("transfers.transfer5.title"),
      link: t("transfers.transfer5.link")
    },
    {
      title: t("transfers.transfer6.title"),
      link: t("transfers.transfer6.link")
    },
    {
      title: t("transfers.transfer7.title"),
      link: t("transfers.transfer7.link")
    },
    {
      title: t("transfers.transfer8.title"),
      link: t("transfers.transfer8.link")
    }
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t("subtitle")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </div>

        {/* Transfers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {transfers.map((transfer, index) => (
            <Link
              key={index}
              href={`/${locale}${transfer.link}`}
              className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between border border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white font-medium flex-1 pr-4">
                {transfer.title}
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedTransfers;

