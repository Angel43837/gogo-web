"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { CTAButton } from "@/components/ui/Button";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cambia la apariencia de la navbar al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al cambiar de ruta
  useEffect(() => setOpen(false), [pathname]);

  // Bloquea el scroll del body con el menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-gogo",
        scrolled || open
          ? "border-b border-white/15 bg-flame-mid2/90 backdrop-blur-xl shadow-lift"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className={cn(
          "container flex items-center justify-between transition-all duration-400 ease-gogo",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Logo variant="light" lockup="stacked" size={scrolled ? 40 : 48} priority />

        {/* Enlaces — desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors duration-300",
                    active ? "text-white" : "text-white/75 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-pill bg-white transition-transform duration-300 ease-gogo",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <CTAButton href="/descarga" variant="onBrand" size="sm" className="hidden sm:inline-flex">
            <Download className="h-4 w-4" aria-hidden />
            Descarga la App
          </CTAButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/12
                       text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/20 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/15 bg-flame-mid2 lg:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                      pathname === link.href
                        ? "bg-white/20 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="mt-3">
                <CTAButton href="/descarga" variant="onBrand" size="lg" fullWidth>
                  <Download className="h-4 w-4" aria-hidden />
                  Descarga la App
                </CTAButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
