import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import trMessages from "../../../messages/tr.json";
import enMessages from "../../../messages/en.json";
import frMessages from "../../../messages/fr.json";

const messagesMap = {
  tr: trMessages,
  en: enMessages,
  fr: frMessages,
};

type Locale = keyof typeof messagesMap;

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }, { locale: "fr" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const messages = messagesMap[typedLocale];

  if (!messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}




