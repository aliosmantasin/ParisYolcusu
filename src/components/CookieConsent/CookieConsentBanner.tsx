import { useTranslations } from "next-intl";
import ClientCookieBanner from "./ClientCookieBanner";
import CookiePreferencesModal from "./CookiePreferencesModal";

export default function CookieConsentBanner() {
  const t = useTranslations("CookieBanner");

  const translations = {
    title: t("title"),
    description: t("description"),
    rejectAll: t("rejectAll"),
    preferences: t("preferences"),
    acceptAll: t("acceptAll")
  };

  return (
    <>
      <ClientCookieBanner translations={translations} />
      <CookiePreferencesModal />
    </>
  );
} 