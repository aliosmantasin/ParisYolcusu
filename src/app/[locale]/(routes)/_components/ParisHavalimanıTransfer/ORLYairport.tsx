"use client";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const ORLYairport = () => {
  const t = useTranslations("ParisMerkezeNasilGidilir");

  return (
    <section className="my-20">
      <div className="max-w-5xl flex flex-wrap mx-auto justify-center shadow-lg rounded-lg overflow-hidden cardBgColor">
        <div className="w-full sm:w-1/2 bg-white">
          <Image
            src="/images/orlycart.webp"
            alt={t("ORLYairport.title")}
            width={400}
            height={250}
            className="w-full h-56 object-cover brightness-100 dark:brightness-50"
          />
        </div>
        <div className="p-4 w-full sm:w-1/2">
          <h3 className="text-xl font-semibold HeadStyle">{t("ORLYairport.title")}</h3>
          <p className="paragraphStyle mt-2">{t("ORLYairport.description1")}</p>
          <p className="paragraphStyle mt-2">{t("ORLYairport.description2")}</p>
          <p className="paragraphStyle mt-2">{t("ORLYairport.description3")}</p>
        </div>
      </div>
    </section>
  );
};

export default ORLYairport;
