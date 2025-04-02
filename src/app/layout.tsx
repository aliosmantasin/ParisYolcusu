import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 🔹 `params` bir `Promise` olarak geliyor
}) {
  const resolvedParams = await params; // ✅ `params`'ı çözümle
  const locale = resolvedParams?.locale || "tr"; // Varsayılan dil olarak "tr" kullanıyoruz
  console.log("ResolvedParams LayoutGenel:", locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-NJC2MR8S"/>
      <body className="scroll-smooth">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="parisyolcusu-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
