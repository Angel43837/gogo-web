"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bike, Download, MapPin, PackageCheck, Store, UtensilsCrossed } from "lucide-react";
import { PhoneMockup, ScreenTracking } from "@/components/ui/PhoneMockup";
import { CTAButton } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionTitle";
import { InlineLogo } from "@/components/ui/Logo";
import { FloatingBadge } from "@/components/hero/FloatingBadge";

const ease = [0.22, 1, 0.36, 1] as const;

const roles = [
  { icon: UtensilsCrossed, label: "Usuarios", href: "#ecosistemas" },
  { icon: Store, label: "Restaurantes", href: "#ecosistemas" },
  { icon: Bike, label: "Repartidores", href: "#ecosistemas" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-32" aria-labelledby="hero-title">
      {/* Fondo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-brand" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-dark mask-fade-b opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[36rem] w-[36rem] rounded-full bg-primary-soft/50 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-accent/12 blur-[100px]"
      />

      <div className="container grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24">
        {/* Columna de texto */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Eyebrow tone="brand">Plataforma de delivery</Eyebrow>
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06, ease }}
            className="mt-5 font-display text-[2.6rem] font-black leading-[1.02] tracking-tight text-white text-balance
                       xs:text-[3rem] sm:text-6xl lg:text-[4.2rem] 2xl:text-[4.6rem]"
          >
            Tu comida.
            <br />
            Tu restaurante.
            <br />
            <span className="text-brand-gradient-light">Tu oportunidad.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14, ease }}
            className="mt-6 max-w-xl text-base font-medium leading-relaxed text-onBrand text-pretty sm:text-lg"
          >
            <InlineLogo variant="dark" /> es la plataforma que conecta a quienes quieren pedir, a los
            restaurantes que quieren
            vender y a los repartidores que llevan cada pedido hasta la puerta. Un solo ecosistema,
            tres formas de participar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <CTAButton href="/descarga" variant="onBrand" size="lg" className="w-full sm:w-auto">
              <Download className="h-5 w-5" aria-hidden />
              Descarga la App
            </CTAButton>
            <CTAButton href="#como-funciona" variant="onBrandGhost" size="lg" className="w-full sm:w-auto">
              Conoce cómo funciona
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
            </CTAButton>
          </motion.div>

          {/* Accesos a los tres ecosistemas */}
          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="mt-9 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          >
            {roles.map((role) => (
              <li key={role.label}>
                <a
                  href={role.href}
                  className="group inline-flex items-center gap-2 rounded-pill border border-white bg-white px-3.5 py-2
                             text-sm font-bold text-onBrand transition-all duration-300 ease-gogo
                             hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <role.icon className="h-4 w-4 text-primary" aria-hidden />
                  {role.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Columna visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease }}
          className="relative mx-auto w-full max-w-[19rem] text-white sm:max-w-[21rem] lg:max-w-[22rem]"
        >
          {/* Resplandor tras el teléfono */}
          <div
            aria-hidden
            className="absolute inset-x-4 top-10 -z-10 h-3/4 rounded-[50%] bg-black/15 blur-[70px]"
          />

          <PhoneMockup label="Interfaz conceptual — no es una captura real">
            <ScreenTracking />
          </PhoneMockup>

          {/* Elementos flotantes del flujo del pedido */}
          <FloatingBadge
            icon={Store}
            title="Pedido recibido"
            caption="El restaurante lo prepara"
            className="-left-2 top-[12%] origin-left scale-90 xs:-left-4 sm:-left-12 sm:scale-100"
            delay={0.1}
          />
          <FloatingBadge
            icon={Bike}
            title="Repartidor en camino"
            className="-right-2 top-[34%] origin-right scale-90 xs:-right-3 sm:-right-10 sm:scale-100"
            delay={0.45}
            accent
          />
          <FloatingBadge
            icon={MapPin}
            title="Seguimiento en vivo"
            caption="Estado del pedido"
            className="-left-2 top-[58%] origin-left scale-90 xs:-left-5 sm:-left-14 sm:scale-100"
            delay={0.8}
          />
          <FloatingBadge
            icon={PackageCheck}
            title="Pedido entregado"
            className="-right-1 bottom-[13%] origin-right scale-90 xs:-right-2 sm:-right-8 sm:scale-100"
            delay={1.1}
          />
        </motion.div>
      </div>
    </section>
  );
}
