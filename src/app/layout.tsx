import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../components/LanguageProvider";

// 🌍 Tüm çeviri dosyalarını içe aktar
import trMessages from "../../messages/tr.json";
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";

// 🌍 Desteklenen diller
const locales = ["tr", "en", "fr"];

// 🌍 Çeviri mesajlarını haritaya ekle
const messagesMap = {
  tr: trMessages,
  en: enMessages,
  fr: frMessages,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "tr";
  
  // Eğer geçerli bir dil değilse 404 sayfasına yönlendir
  if (!locales.includes(locale)) {
    notFound();
  }

  // 📌 JSON dosyasını haritadan al
  const messages = messagesMap[locale as keyof typeof messagesMap] || trMessages;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="scroll-smooth">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="parisyolcusu-theme"
          >
            <LanguageProvider />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
