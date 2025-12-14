import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider } from "../components/LanguageProvider";
// import { SecurityProvider } from "../components/SecurityProvider";

// 🌍 Tüm çeviri dosyalarını içe aktar
import trMessages from "../../messages/tr.json";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout'ta varsayılan locale kullan, gerçek locale [locale] layout'unda belirlenir
  const locale = "tr";
  
  // 📌 JSON dosyasını haritadan al (varsayılan olarak tr kullanılır, gerçek locale [locale] layout'unda set edilir)
  const messages = trMessages;

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
