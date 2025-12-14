"use client";

import { useCookieConsent } from "./CookieConsentContext";


export default function CookieOverlay() {
  const { hasInteracted } = useCookieConsent();

  // Overlay kaldırıldı - artık dark arka plan yok
  return null;
} 