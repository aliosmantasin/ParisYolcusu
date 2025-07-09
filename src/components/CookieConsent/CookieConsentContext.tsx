"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ConsentType = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  personalization: boolean;
  security: boolean;
};

type ConsentRegion = 'TR' | 'EU' | 'OTHER';

interface CookieConsentContextType {
  consent: ConsentType;
  hasInteracted: boolean;
  region: ConsentRegion;
  updateConsent: (newConsent: Partial<ConsentType>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  showPreferences: () => void;
  isPreferencesOpen: boolean;
  closePreferences: () => void;
}

const defaultConsent: ConsentType = {
  analytics: false,
  marketing: false,
  functional: true,
  personalization: false,
  security: true, // Security her zaman true olmalı
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const detectRegion = (): ConsentRegion => {
  // Burada gerçek bir bölge tespiti yapılabilir
  // Şimdilik basit bir örnek
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('Istanbul')) return 'TR';
  if (timezone.includes('Europe')) return 'EU';
  return 'OTHER';
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentType>(defaultConsent);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [region, setRegion] = useState<ConsentRegion>('OTHER');

  useEffect(() => {
    // Bölge tespiti
    setRegion(detectRegion());

    // Kayıtlı izinleri yükle
    const savedConsent = localStorage.getItem("cookieConsent");
    const savedInteraction = localStorage.getItem("cookieInteraction");
    
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        // Yeni consent yapısına uygun olarak güncelle
        setConsent({
          ...defaultConsent,
          ...parsedConsent,
          security: true, // Security her zaman true
        });
      } catch (error) {
        console.error("Failed to parse saved consent", error);
        setConsent(defaultConsent);
      }
    }
    
    if (savedInteraction === "true") {
      setHasInteracted(true);
    }
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      localStorage.setItem("cookieInteraction", "true");
    }
  }, [consent, hasInteracted]);

  const updateConsent = (newConsent: Partial<ConsentType>) => {
    setConsent(prev => ({
      ...prev,
      ...newConsent,
      security: true, // Security her zaman true kalmalı
    }));
    setHasInteracted(true);
  };

  const acceptAll = () => {
    setConsent({
      analytics: true,
      marketing: true,
      functional: true,
      personalization: true,
      security: true,
    });
    setHasInteracted(true);
    setIsPreferencesOpen(false);
  };

  const rejectAll = () => {
    setConsent({
      ...defaultConsent,
      security: true, // Security her zaman true kalmalı
    });
    setHasInteracted(true);
    setIsPreferencesOpen(false);
    clearTrackingCookies();
  };

  const clearTrackingCookies = () => {
    const cookiesToClear = {
      ga: ['_ga', '_gid', '_gat'],
      fb: ['_fbp', '_fbc'],
      clarity: ['_clck', '_clsk'],
      custom: [] // Özel çerezler buraya eklenebilir
    };

    const clearCookie = (name: string) => {
      const domains = [
        window.location.hostname,
        `.${window.location.hostname}`,
        `www.${window.location.hostname}`,
        `.www.${window.location.hostname}`
      ];

      domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      });
    };

    Object.values(cookiesToClear).flat().forEach(clearCookie);
    console.log('Tracking cookies cleared');
  };

  const showPreferences = () => {
    setIsPreferencesOpen(true);
  };

  const closePreferences = () => {
    setIsPreferencesOpen(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasInteracted,
        region,
        updateConsent,
        acceptAll,
        rejectAll,
        showPreferences,
        isPreferencesOpen,
        closePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
} 