import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";


// 🌍 Tüm çeviri dosyalarını içe aktar
import trMessages from "../../../../messages/tr.json";
import enMessages from "../../../../messages/en.json";
import { Metadata } from "next";
import Navbar from "./_components/menu/Navbar";
import Footer from "./_components/menu/Footer";
import ScrollTop from "./_components/lib/ScrollTop/ScrollTop";
import { MdKeyboardArrowUp } from "react-icons/md";

// 🌍 Desteklenen diller
const locales = ["tr", "en"];

export const metadata: Metadata = {
  title: "Paris Havalimanı Transfer & Özel Şoför Hizmeti | Paris Yolcusu",
  description: "Paris’te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz. Hemen rezervasyon yapın ve rahat bir yolculuğun tadını çıkarın!",
  verification: {
    google: "buraya code gelecek",
  },
};

// 🌍 Çeviri mesajlarını haritaya ekle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messagesMap: Record<string, any> = {
  tr: trMessages,
  en: enMessages,
};

export default async function RoutesLayout({children,params,}:{children: ReactNode;
  params: Promise<{ locale?: string }>; // ✅ Asenkron destek eklendi
}) {
  const resolvedParams = await params; // ✅ `params`'ı bekleyerek al
  const locale = locales.includes(resolvedParams.locale ?? "") ? resolvedParams.locale! : "tr"; // ✅ Hata çözümü

  // 📌 JSON dosyasını haritadan al
  const messages = messagesMap[locale] || trMessages;

  console.log("📌 Gelen params:", resolvedParams);
  console.log("📌 Kullanılan dil:", locale);

  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar/>
        
          <div>
            {children} 
          </div>
          <ScrollTop>
              <MdKeyboardArrowUp />
            </ScrollTop>
          <Footer/>
        </NextIntlClientProvider>
  );
}

 

