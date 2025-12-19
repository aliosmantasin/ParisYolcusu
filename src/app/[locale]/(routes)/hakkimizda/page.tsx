import React from 'react';

import { seoData } from "@/lib/seo";
import { Metadata } from "next";
import { QuestionsSSS } from '../_components/homepage/QuestionsSSS';
import CleanCar from '../_components/homepage/CleanCar';
import AboutComponent from '../_components/homepage/AboutComponent';
import CallToActionComponent from '../_components/homepage/CallToActionComponent';

type Props = {
  params: Promise<{ locale?: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale ?? "tr";
  const pagePath = `/${locale}/hakkimizda`;

  const seo = seoData[pagePath] || {
    title: "Hakkımızda | Paris Yolcusu",
    description: "Paris Yolcusu hakkında bilgi edinin. Profesyonel VIP transfer hizmetlerimiz ve deneyimli ekibimiz hakkında detaylı bilgi.",
  };

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function HakkimizdaPage({ params }: Props) {
  return (
    <>
     <AboutComponent/>
      <QuestionsSSS/>
      <CleanCar/>
      <CallToActionComponent/>
    
    </>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'fr' }
  ];
}


