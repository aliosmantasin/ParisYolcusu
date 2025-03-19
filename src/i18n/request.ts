import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Locale = "tr" | "en"; // ✅ Doğru locale tanımları

export default getRequestConfig(async ({ requestLocale }) => {
  // ✅ Promise'i çözmek için await kullanıyoruz
  let locale = (await requestLocale) as string | undefined;

  // Eğer locale tanımlı değilse veya geçerli bir dil değilse varsayılanı kullan
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  console.log("Kullanıcı dili:", locale); // 🛠️ Debug için log ekledik

  try {
    return {
      locale,
      messages: (await import(`@/messages/${locale}.json`)).default,
     
    };
  } catch (error) {
    console.error(`Çeviri dosyası yüklenirken hata oluştu: ${locale}`, error);
    return {
      locale,
      messages: {},
    };
  }
});
