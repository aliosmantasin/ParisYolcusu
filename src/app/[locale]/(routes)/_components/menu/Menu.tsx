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
import { useTranslations } from "next-intl"

export function BigScreenMenu() {
  const t = useTranslations("Navbar")

  
  return (
    <NavigationMenu className="hidden sm:flex ">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" className={navigationMenuTriggerStyle()}>
            {t("HomePageNabar")}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/#hizmetlerimiz" className={navigationMenuTriggerStyle()}>
            {t("Services")}
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/#about" className={navigationMenuTriggerStyle()}>
            {t("About")}
          </Link>
        </NavigationMenuItem>

    
      </NavigationMenuList>
    </NavigationMenu>
  )
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

