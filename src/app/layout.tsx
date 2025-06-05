import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../components/LanguageProvider";
import { SecurityProvider } from "../components/SecurityProvider";

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
        <head>
        <meta name="facebook-domain-verification" content="8e31me7fwh1ux38rp50z2b4g752sgo" />
      </head>
      <body className="scroll-smooth">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="parisyolcusu-theme"
          >
            <SecurityProvider />
            <LanguageProvider />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
