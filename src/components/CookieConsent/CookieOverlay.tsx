"use client";

import { useCookieConsent } from "./CookieConsentContext";


export default function CookieOverlay() {
  const { hasInteracted } = useCookieConsent();

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