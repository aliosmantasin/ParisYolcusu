"use client";

import { useCookieConsent } from "../context/CookieConsentContext";
import { useTranslations } from "next-intl";

export default function CookieConsentManager() {
  const { showPreferences } = useCookieConsent();
  const t = useTranslations("CookieBanner");

  return (
    <button 
      onClick={showPreferences}
      className="text-sm hover:text-gray-500 transition-colors focus:outline-none p-1"
      aria-label={t("preferences")}
      title={t("preferences")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="inline-block"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="8" cy="9" r="1.2"></circle>
        <circle cx="16" cy="9" r="1.2"></circle>
        <circle cx="10" cy="14" r="1.2"></circle>
        <circle cx="15" cy="15" r="1.2"></circle>
        <circle cx="14" cy="6" r="1.2"></circle>
        <circle cx="6" cy="12" r="1.2"></circle>
      </svg>
    </button>
  );
} 