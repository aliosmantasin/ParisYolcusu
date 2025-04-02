"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const t = useTranslations("ParisGeziTurlari");

  return (
    <section className="relative h-[600px] w-full">
      <div className="absolute inset-0">
        <Image
          src="/images/parisGeziKapak.webp"
          alt={t("HeroSection.title")}
          fill
          className="hidden sm:flex object-cover p-5 brightness-100 dark:brightness-50 shadow-lg"
          priority
        />
      </div>

      <div className="absolute inset-0">
        <Image
          src="/images/mobilKapakGezi.jpg"
          alt={t("HeroSection.title")}
          fill
          className="flex sm:hidden object-cover p-5 brightness-100 dark:brightness-50"
          priority
        />
      </div>

      <div className="absolute bottom-7 sm:bottom-4 left-1/2 -translate-x-1/2 text-center p-4 w-[400px] sm:w-auto">
        <h1 className="mb-4 text-3xl font-bold md:text-3xl font-[Caveat]">
          {t("HeroSection.title")}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl font-[Caveat]">
          {t("HeroSection.description")}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
