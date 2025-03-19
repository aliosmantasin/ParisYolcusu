"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ModeToggle"

export function MobilMenu() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  // 📌 Hash linke tıklandığında ilgili bölüme scroll yap
  const handleScrollToSection = (id: string) => {
    setOpen(false); // Menü kapat

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300); // Menünün kapanmasını beklemek için 300ms gecikme
  };

  return (
    <div className="flex sm:hidden space-y-5">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Menu</Button>
        </SheetTrigger>

        <SheetContent className="w-full p-2 h-full snap-y overflow-y-auto max-h-[100vh]">
          <div className="flex space-x-5 border-b-2 p-2 border-black-500">
            <div>
              <ModeToggle />
            </div>
            <Link href="/dijital-pazarlama-baslagic-kilavuzu">
              <Button onClick={handleClose} className="min-w-36 animate-pulse">
                CTA Button
              </Button>
            </Link>
          </div>

          <NavigationMenu className="flex justify-start w-full max-w-96">
            <NavigationMenuList className="flex flex-col space-y-5 mt-8 w-full">
              <NavigationMenuItem className="flex w-full max-w-96">
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent text-[1rem]"
                    )}
                    onClick={handleClose}
                  >
                    Ana Sayfa
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex w-full max-w-96">
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-transparent text-[1rem] cursor-pointer"
                  )}
                  onClick={() => handleScrollToSection("hizmetlerimiz")}
                >
                  <span>Hizmetlerimiz</span>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex w-full max-w-96">
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-transparent text-[1rem] cursor-pointer"
                  )}
                  onClick={() => handleScrollToSection("about")}
                >
                  <span>Hakkımızda</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SheetContent>
      </Sheet>
    </div>
  );
}
