"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LanguageProvider() {
  const pathname = usePathname();
  
  useEffect(() => {
    let locale = "tr";
    if (pathname.startsWith("/en")) {
      locale = "en";
    } else if (pathname.startsWith("/fr")) {
      locale = "fr";
    }
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
} 