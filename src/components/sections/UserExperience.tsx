"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { userJourney } from "@/data/users";
import { PhoneMockup, ScreenTracking } from "@/components/ui/PhoneMockup";
import { ScreenAppDemo, demoChapters } from "@/components/ui/ScreenAppDemo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTAButton } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

/** Experiencia del usuario: Descubre → Elige → Pide → Sigue → Recibe. */
export function UserExperience() {
  const [active, setActive] = useState(0);
  const step = userJourney[active];
  /*
   * Las tres primeras etapas muestran la GRABACIÓN REAL de la app, saltando
   * al momento del clip que corresponde a cada una. Las dos últimas muestran
   * el seguimiento del pedido con el recorrido animado.
   */
  const chapters = [demoChapters.descubre, demoChapters.elige, demoChapters.pide];
  const isDemo = active <= 2;
  const screen = isDemo ? <ScreenAppDemo seekTo={chapters[active]} /> : <ScreenTracking />;

  return (
    <section id="usuarios" className="relative overflow-hidden bg-brand-deep text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[30rem] w-[30rem] rounded-full bg-primary/25 blur-[110px]"
      />

      <div className="section-shell relative">
        <SectionTitle
          eyebrow="Experiencia del usuario"
          tone="dark"
          title={
            <>
              Todo lo que necesitas,{" "}
              <span className="text-brand-gradient">en unos cuantos pasos</span>
            </>
          }
          description="Desde que se te antoja algo hasta que llega a tu puerta, cada paso ocurre dentro de la misma app."
          className="mx-auto max-w-3xl"
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Pasos */}
          <div className="order-2 lg:order-1">
            {/* Selector: scroll horizontal en móvil */}
            <div
              role="tablist"
              aria-label="Etapas de la experiencia del usuario"
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-wrap lg:px-0"
            >
              {userJourney.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={i === active}
                  aria-controls={`panel-${s.id}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2.5 text-sm font-bold transition-all duration-300 ease-gogo",
                    i === active
                      ? "border-primary bg-primary text-primary-fg shadow-glow"
                      : "border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white",
                  )}
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative mt-8 min-h-[11rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  id={`panel-${step.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${step.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-soft">
                    Paso {active + 1} de {userJourney.length}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                    {step.headline}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <Reveal delay={0.1} className="mt-8">
              <CTAButton href="/usuarios" size="lg">
                Quiero pedir
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
              </CTAButton>
            </Reveal>
          </div>

          {/* Mockup */}
          <Reveal
            direction="left"
            className="order-1 mx-auto w-full max-w-[16rem] sm:max-w-[17rem] lg:order-2 lg:max-w-[18.5rem]"
          >
            <PhoneMockup
              label={
                isDemo
                  ? "Grabación real de la app"
                  : "Interfaz conceptual — no es una captura real"
              }
            >
              {screen}
            </PhoneMockup>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
