"use client"
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import { ChevronDown } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"

export function BigScreenMenu() {
  const t = useTranslations("Navbar")
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)

  
  return (
    <NavigationMenu className="hidden sm:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" className={navigationMenuTriggerStyle()}>
            {t("HomePageNabar")}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              className={cn(navigationMenuTriggerStyle(), "flex items-center gap-1")}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
            {t("Services")}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              className="w-56"
            >
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/paris-havalimanlari-transfer`}>
                  {t("transfers.airportTransfer")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/paris-gezi-turlari`}>
                  {t("transfers.disneylandTransfer")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/paris-gezi-turlari`}>
                  {t("transfers.parisCityTour")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/paris-havalimanlari-transfer`}>
                  {t("transfers.parisTransfer")}
          </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/hakkimizda" className={navigationMenuTriggerStyle()}>
            {t("About")}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/iletisim" className={navigationMenuTriggerStyle()}>
            {t("Contact")}
          </Link>
        </NavigationMenuItem>

    
      </NavigationMenuList>
    </NavigationMenu>
  )
}

