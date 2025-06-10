"use client";

import ClientCookiePreferencesModal from "./ClientCookiePreferencesModal";
import { useCookieConsent } from "./CookieConsentContext";

interface CookiePreferencesClientWrapperProps {
  translations: {
    title: string;
    close: string;
    description: string;
    manageInfo: string;
    necessary: {
      title: string;
      description: string;
      required: string;
    };
    functional: {
      title: string;
      description: string;
    };
    analytics: {
      title: string;
      description: string;
    };
    marketing: {
      title: string;
      description: string;
    };
    personalization: {
      title: string;
      description: string;
    };
    security: {
      title: string;
      description: string;
      required: string;
    };
    rejectAll: string;
    acceptAll: string;
    savePreferences: string;
    openLabel: string;
    closeLabel: string;
    onText: string;
    offText: string;
    developedBy: string;
  }
}

export default function CookiePreferencesClientWrapper({ translations }: CookiePreferencesClientWrapperProps) {
  const { isPreferencesOpen } = useCookieConsent();
  
  // Eğer tercihler açık değilse, hiçbir şey render etme
  if (!isPreferencesOpen) {
    return null;
  }

  return <ClientCookiePreferencesModal translations={translations} />;
} 