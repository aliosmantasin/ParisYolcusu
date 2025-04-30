"use client";

import { useCookieConsent } from "../../context/CookieConsentContext";
import { useEffect } from "react";

export default function CookieOverlay() {
  const { hasInteracted } = useCookieConsent();

  useEffect(() => {
    if (!hasInteracted) {
      // Scroll'u engelle
      document.body.style.overflow = 'hidden';
    } else {
      // Scroll'u serbest bırak
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasInteracted]);

  if (hasInteracted) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-40" 
      aria-hidden="true"
    />
  );
} 