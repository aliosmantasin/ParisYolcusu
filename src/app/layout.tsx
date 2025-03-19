
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 🔹 `params` bir `Promise` olarak geliyor
}) {
  const resolvedParams = await params; // ✅ `params`'ı çözümle
  const locale = resolvedParams?.locale || "en"; // Varsayılan olarak "en"

  return (
    <html lang={locale} className="scroll-smooth">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
