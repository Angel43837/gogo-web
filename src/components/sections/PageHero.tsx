import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/animations/Reveal";

/** Cabecera estándar de las páginas internas. */
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  breadcrumb,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumb: string;
}) {
  return (
    <section className="on-brand relative overflow-hidden border-b border-white/15 bg-brand pt-28 lg:pt-36">
      <div aria-hidden className="absolute inset-0 bg-grid-dark mask-fade-b opacity-22" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full bg-primary-soft/45 blur-[100px]"
      />

      <div className="container relative pb-14 lg:pb-20">
        <nav aria-label="Ruta de navegación" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs font-semibold text-onBrand/75">
            <li>
              <Link href="/" className="transition-colors hover:text-onBrand">
                Inicio
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-bold text-onBrand">{breadcrumb}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow tone="brand">{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-[2.4rem] font-black leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-onBrand text-pretty sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
          {actions && (
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
