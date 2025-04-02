"use client";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const BVAairport = () => {
  const t = useTranslations("ParisMerkezeNasilGidilir");

  return (
    <section className="my-20">
      <div className="max-w-5xl flex flex-wrap mx-auto justify-center shadow-lg rounded-lg overflow-hidden cardBgColor">
        <div className="w-full sm:w-1/2">
          <Image
            src="/images/bvacart.webp"
            alt={t("BVAairport.title")}
            width={400}
            height={250}
            className="w-full h-56 object-cover brightness-100 dark:brightness-50"
          />
        </div>
        <div className="p-4 w-full sm:w-1/2">
          <h3 className="text-xl font-semibold HeadStyle">{t("BVAairport.title")}</h3>
          <p className="paragraphStyle mt-2">{t("BVAairport.description1")}</p>
          <p className="paragraphStyle mt-2">{t("BVAairport.description2")}</p>
        </div>
      </div>
    </section>
  );
};

export default BVAairport;
