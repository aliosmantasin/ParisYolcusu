import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider } from "../components/LanguageProvider";
// import { SecurityProvider } from "../components/SecurityProvider";

// 🌍 Tüm çeviri dosyalarını içe aktar
import trMessages from "../../messages/tr.json";

// 🌍 Çeviri mesajlarını haritaya ekle
const messagesMap = {
  tr: trMessages,
  en: trMessages, // Root layout'ta varsayılan olarak tr kullanılıyor
  fr: trMessages, // Gerçek locale [locale] route group'unda yönetiliyor
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout'ta locale bilgisi yok, varsayılan olarak tr kullan
  // Gerçek locale [locale] route group'undaki layout'ta yönetiliyor
  const locale = "tr";

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
            {/* <SecurityProvider /> */}
            <LanguageProvider />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
