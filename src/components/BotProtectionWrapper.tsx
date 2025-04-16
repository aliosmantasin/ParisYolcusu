"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { BotProtection } from "./BotProtection";

export function BotProtectionWrapper() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // Only render the BotProtection component after the component has mounted
  // This ensures that the locale is properly set
  useEffect(() => {
    setMounted(true);
    console.log("BotProtectionWrapper mounted with locale:", locale);
  }, [locale]);

  if (!mounted) {
    return null;
  }

  return <BotProtection />;
} 