"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ModeToggle } from "@/components/ModeToggle"
import { useTranslations, useLocale } from "next-intl"

export function MobilMenu() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const t = useTranslations("Navbar")
  const locale = useLocale()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])


  React.useEffect(() => {
    const sectionToScroll = localStorage.getItem('scrollToSection');
    if (sectionToScroll) {
      setTimeout(() => {
        const section = document.getElementById(sectionToScroll);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
      localStorage.removeItem('scrollToSection');
    }
  }, []);

  if (!mounted) {
    return null
  }

  return (
    <div className="flex sm:hidden space-y-5" key={`mobile-menu-${locale}`}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Menu</Button>
        </SheetTrigger>

        <SheetContent className="w-full p-2 h-full snap-y overflow-y-auto max-h-[100vh]">
          <div className="flex space-x-5 border-b-2 p-2 border-black-500">
            <div>
              <ModeToggle />
            </div>
            <Link href="https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20iletişime%20geçiyorum..">
              <Button onClick={handleClose} className="min-w-36 animate-pulse">
                {t("CTA")}
              </Button>
            </Link>
          </div>

          <NavigationMenu className="flex justify-start w-full max-w-96">
            <NavigationMenuList className="flex flex-col space-y-2 mt-8 w-full">
              <NavigationMenuItem className="flex w-full max-w-96">
                <Link href="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-transparent text-[1rem] w-full justify-start")} onClick={handleClose}>
                  {t("HomePageNabar")}
                </Link>
              </NavigationMenuItem>
           
              <NavigationMenuItem className="flex w-full max-w-96">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="transfers" className="border-none">
                    <AccordionTrigger className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-transparent text-[1rem] w-full justify-between py-2 px-4")}>
                      {t("Services")}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pt-2 space-y-2">
                      <Link
                        href={`/${locale}/paris-havalimanlari-transfer`}
                        className="block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        onClick={handleClose}
                      >
                        {t("transfers.airportTransfer")}
                      </Link>
                      <Link
                        href={`/${locale}/paris-gezi-turlari`}
                        className="block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        onClick={handleClose}
                      >
                        {t("transfers.disneylandTransfer")}
                      </Link>
                      <Link
                        href={`/${locale}/paris-gezi-turlari`}
                        className="block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        onClick={handleClose}
                      >
                        {t("transfers.parisCityTour")}
                      </Link>
                      <Link
                        href={`/${locale}/paris-havalimanlari-transfer`}
                        className="block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        onClick={handleClose}
                      >
                        {t("transfers.parisTransfer")}
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </NavigationMenuItem>
           
              <NavigationMenuItem className="flex w-full max-w-96">
                <Link href="/hakkimizda" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-transparent text-[1rem] w-full justify-start")} onClick={handleClose}>
                  {t("About")}
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex w-full max-w-96">
                <Link href="/iletisim" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-transparent text-[1rem] w-full justify-start")} onClick={handleClose}>
                  {t("Contact")}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SheetContent>
      </Sheet>
    </div>
  );
}
