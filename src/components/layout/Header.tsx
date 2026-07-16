"use client";

import Image from "next/image";
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
  { href: "/health-tourism", key: "healthTourism" },
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
        <Link href="/" className="shrink-0">
          <Image
            src="/logo/tacdent-logo.png"
            alt={t("brand")}
            width={920}
            height={220}
            sizes="(max-width: 640px) 160px, 200px"
            className="h-9 w-auto sm:h-10 dark:rounded-md dark:bg-white/95 dark:px-2 dark:py-1"
            priority
          />
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
                <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
                <Link href="/" className="mx-auto w-fit">
                  <Image
                    src="/logo/tacdent-logo.png"
                    alt={t("brand")}
                    width={920}
                    height={220}
                    sizes="160px"
                    className="h-9 w-auto dark:rounded-md dark:bg-white/95 dark:px-2 dark:py-1"
                  />
                </Link>
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
                      className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
