import createMiddleware from "next-intl/middleware";

// URL yönlendirme kuralları
const pathnames = {
  '/': '/',
  '/paris-havalimanlari-transfer': {
    tr: '/paris-havalimanlari-transfer',
    en: '/paris-airport-transfer'
  },
  '/paris-gezi-turlari': {
    tr: '/paris-gezi-turlari',
    en: '/paris-sightseeing-tours'
  },
  '/rezervasyon-formu': {
    tr: '/rezervasyon-formu',
    en: '/reservation-form'
  },
  '/bilgi-alma-formu': {
    tr: '/bilgi-alma-formu',
    en: '/information-form'
  },
};

// Middleware oluştur
const middleware = createMiddleware({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // URL yönlendirme kurallarını ekle
  pathnames,
  // URL yapısını dil seçimine göre değiştir
  localePrefix: 'always',
  // URL yönlendirme kurallarını doğru şekilde uygula
  localeDetection: true,
});

// Middleware'i dışa aktar
export default middleware;

// Matcher yapılandırması
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // API veya statik dosyalara dokunma
};
