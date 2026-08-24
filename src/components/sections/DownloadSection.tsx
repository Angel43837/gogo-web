import { Bell, Smartphone } from "lucide-react";
import { PhoneMockup, ScreenDiscover } from "@/components/ui/PhoneMockup";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { Eyebrow } from "@/components/ui/SectionTitle";
import { InlineLogo } from "@/components/ui/Logo";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Descarga de la app.
 * Los botones de tienda están deshabilitados: aún no existen enlaces oficiales
 * y no deben inventarse.
 */
export function DownloadSection() {
  return (
    <section id="app" className="relative overflow-hidden bg-brand-deep">
      <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
        <div
          className="bg-brand-vivid relative overflow-hidden rounded-[2rem] border border-white/15
                     px-6 py-12 shadow-lift sm:rounded-[2.5rem] sm:px-10 lg:px-14 lg:py-16"
        >
          <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-18" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/12 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <Reveal>
                <Eyebrow tone="dark">La app de GOGO</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-display text-[2.1rem] font-black leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.4rem]">
                  Todo empieza con <InlineLogo variant="plain" />.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed text-onBrand text-pretty lg:mx-0 sm:text-lg">
                  Pedir, vender o repartir: los tres caminos viven en la misma aplicación. Estamos
                  preparando su publicación en las tiendas.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-9 flex flex-col items-center gap-5 lg:items-start">
                  <StoreButtons tone="dark" />
                  <p className="flex items-center gap-2 text-xs font-semibold text-onBrand/80">
                    <Bell className="h-3.5 w-3.5" aria-hidden />
                    Los enlaces oficiales de descarga se publicarán en esta página.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" className="mx-auto w-full max-w-[15rem] sm:max-w-[16rem]">
              <div className="text-white">
                <PhoneMockup label="Interfaz conceptual">
                  <ScreenDiscover />
                </PhoneMockup>
              </div>
            </Reveal>
          </div>

          {/* Nota de disponibilidad */}
          <div className="relative mt-10 flex items-center justify-center gap-2 border-t border-onBrand/20 pt-6 text-onBrand/80 lg:justify-start">
            <Smartphone className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Disponibilidad en tiendas — próximamente
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
