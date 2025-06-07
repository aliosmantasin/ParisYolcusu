"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ConsentType = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

interface CookieConsentContextType {
  consent: ConsentType;
  hasInteracted: boolean;
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
  functional: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentType>(defaultConsent);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load consent state from localStorage on mount
    const savedConsent = localStorage.getItem("cookieConsent");
    const savedInteraction = localStorage.getItem("cookieInteraction");
    
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent));
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
    // Save consent state to localStorage whenever it changes
    // Only save if user has interacted with the banner
    if (hasInteracted) {
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      localStorage.setItem("cookieInteraction", "true");
    }
  }, [consent, hasInteracted]);

  const updateConsent = (newConsent: Partial<ConsentType>) => {
    setConsent(prev => ({ ...prev, ...newConsent }));
    setHasInteracted(true);
  };

  const acceptAll = () => {
    setConsent({
      analytics: true,
      marketing: true,
      functional: true,
    });
    setHasInteracted(true);
    setIsPreferencesOpen(false);
  };

  const rejectAll = () => {
    setConsent({
      analytics: false,
      marketing: false,
      functional: false,
    });
    setHasInteracted(true);
    setIsPreferencesOpen(false);
    
    // Google Analytics ve diğer izleme çerezlerini temizle
    clearTrackingCookies();
  };

  // Çerez temizleme fonksiyonu
  const clearTrackingCookies = () => {
    // Google Analytics çerezlerini temizle
    const gaCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || 
      cookie.trim().startsWith('_gid') || 
      cookie.trim().startsWith('_gat')
    );
    
    gaCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
    
    // Facebook Pixel çerezlerini temizle
    const fbCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_fbp') || 
      cookie.trim().startsWith('_fbc')
    );
    
    fbCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
    
    // Microsoft Clarity çerezlerini temizle
    const clarityCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_clck') || 
      cookie.trim().startsWith('_clsk')
    );
    
    clarityCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
    
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