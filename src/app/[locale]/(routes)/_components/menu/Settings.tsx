"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { urlMap } from "../../../../../../lib/i18n";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";
import { ModeToggle } from "../../../../../../components/ModeToggle";
import Link from "next/link";
import { MobilMenu } from "./mobilmenu";
import { useTranslations } from "next-intl";

const Settings = () => {
  const router = useRouter();
  const pathname = usePathname(); 
  const currentLocale = pathname.startsWith("/en") ? "en" : pathname.startsWith("/fr") ? "fr" : "tr";

  const t = useTranslations("Settings")
  
  const changeLanguage = (newLocale: "tr" | "en" | "fr") => {
    if (pathname === "/tr" || pathname === "/en" || pathname === "/fr") {
      router.push(`/${newLocale}`);
      return;
    }
  
    const cleanPath = pathname.replace(/^\/(tr|en|fr)(\/|$)/, "");
    
    if (!cleanPath) {
      router.push(`/${newLocale}`);
      return;
    }
    
    // URL haritasında bu yol var mı kontrol et
    const mappedPath = Object.keys(urlMap).find(key => 
      urlMap[key][currentLocale] === cleanPath || 
      urlMap[key][newLocale] === cleanPath
    );
    
    if (mappedPath) {
      router.push(`/${newLocale}/${urlMap[mappedPath][newLocale]}`);
      return;
    }
    
    // Eğer haritada yoksa, doğrudan yolu kullan
    router.push(`/${newLocale}/${cleanPath}`);
  };
  
  return (
    <div className="flex items-center space-x-3 relative">
      {/* Dil Seçici */}
      <Select onValueChange={changeLanguage} value={currentLocale}>
        <SelectTrigger className="theme">
          <SelectValue placeholder="Dil Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="tr">Türkçe 🇹🇷</SelectItem>
            <SelectItem value="en">English 🇬🇧</SelectItem>
            <SelectItem value="fr">Français 🇫🇷</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="hidden sm:flex mx-auto items-cSettingsenter">
        <ModeToggle/>
      </div>
 
      <MobilMenu />

      {/* Başlangıç Kılavuzu Butonu */}
      <Link href={t("CTAURL")}>
      <button type="button" className="hidden md:flex justify-center min-w-36 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-[#067481] focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 animate-pulse">
         <span>{t("CTA")}</span>
        </button>
      </Link>
    </div>
  );
};

export default Settings;
