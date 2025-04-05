"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LanguageProvider() {
  const pathname = usePathname();
  
  useEffect(() => {
    const locale = pathname.startsWith("/en") ? "en" : "tr";
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
} 