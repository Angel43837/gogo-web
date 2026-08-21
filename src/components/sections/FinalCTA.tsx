import { ArrowRight, Bike, Store, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/SectionTitle";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

const paths = [
  {
    icon: UtensilsCrossed,
    title: "Quiero pedir",
    description: "Descubre restaurantes, arma tu pedido y recíbelo donde estés.",
    href: "/usuarios",
  },
  {
    icon: Store,
    title: "Quiero vender",
    description: "Lleva tu restaurante a más personas y recibe pedidos desde la app.",
    href: "/restaurantes",
  },
  {
    icon: Bike,
    title: "Quiero repartir",
    description: "Usa tu moto para realizar entregas y generar ingresos.",
    href: "/repartidores",
  },
];

/** CTA final: los tres caminos del ecosistema. */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-soft/35 blur-[120px]"
      />

      <div className="section-shell relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <Eyebrow tone="brand">Da el siguiente paso</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[2.1rem] font-black leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.5rem]">
              GOGO está listo para <span className="text-brand-gradient-light">moverse contigo.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-onBrand text-pretty sm:text-lg">
              Tres caminos, una misma plataforma. Elige el tuyo.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5" as="ul">
          {paths.map((p) => (
            <RevealItem key={p.href} as="li">
              <Link
                href={p.href}
                className="group flex h-full flex-col rounded-3xl border border-white/60 bg-white p-6 text-left shadow-card transition-all duration-500 ease-gogo hover:-translate-y-1.5 hover:shadow-lift sm:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-fg transition-transform duration-500 ease-gogo group-hover:-rotate-6 group-hover:scale-110">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary">
                  Empezar
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 ease-gogo group-hover:translate-x-1.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
