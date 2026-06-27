"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/appointments", key: "appointments" },
] as const;

export default function Header() {
  const t = useTranslations("common");
  const tNav = useTranslations("common.nav");
  const tButtons = useTranslations("common.buttons");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            T
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">{t("brand")}</p>
            <p className="text-xs text-muted-foreground">{t("tagline")}</p>
          </div>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  {tNav(link.key)}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Button
            render={<Link href="/appointments" />}
            className="hidden rounded-full sm:inline-flex"
          >
            {tButtons("bookNow")}
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden" aria-label={t("menu")} />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 px-1">
                <LanguageToggle className="w-full" />
              </div>
              <nav className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      />
                    }
                  >
                    {tNav(link.key)}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/appointments"
                      className="mt-2 inline-flex h-8 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                    />
                  }
                >
                  {tButtons("bookAppointment")}
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
