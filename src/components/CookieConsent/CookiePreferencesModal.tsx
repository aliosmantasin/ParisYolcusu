import { useTranslations } from "next-intl";
import CookiePreferencesClientWrapper from "./CookiePreferencesClientWrapper";


export default function CookiePreferencesModal() {
  const t = useTranslations("CookiePreferences");
  
  const translations = {
    title: t("title"),
    close: t("close"),
    description: t("description"),
    manageInfo: t("manageInfo"),
    necessary: {
      title: t("necessary.title"),
      description: t("necessary.description"),
      required: t("necessary.required"),
    },
    functional: {
      title: t("functional.title"),
      description: t("functional.description"),
    },
    analytics: {
      title: t("analytics.title"),
      description: t("analytics.description"),
    },
    marketing: {
      title: t("marketing.title"),
      description: t("marketing.description"),
    },
    rejectAll: t("rejectAll"),
    acceptAll: t("acceptAll"),
    savePreferences: t("savePreferences"),
    openLabel: t("openLabel"),
    closeLabel: t("closeLabel"),
    onText: t("onText"),
    offText: t("offText"),
    developedBy: t("developedBy")
  };

  // Burada CookiePreferencesClientWrapper'a çevirileri aktarıyoruz
  // Kontroller client-side tarafta yapılacak
  return <CookiePreferencesClientWrapper translations={translations} />;
} 