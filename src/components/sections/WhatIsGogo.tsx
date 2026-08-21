import { ArrowDown, ArrowRight, Bike, Store, UtensilsCrossed } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

const nodes = [
  { icon: UtensilsCrossed, label: "Usuario", detail: "Realiza el pedido" },
  { icon: Store, label: "Restaurante", detail: "Prepara el pedido" },
  { icon: Bike, label: "Repartidor", detail: "Recoge y entrega" },
];

/** "¿Qué es GOGO?" — el triángulo del ecosistema y el flujo del pedido. */
export function WhatIsGogo() {
  return (
    <section id="que-es" className="relative overflow-hidden bg-brand-tint">
      <div className="section-shell">
        <SectionTitle
          eyebrow="¿Qué es GOGO?"
          title={
            <>
              Una plataforma,{" "}
              <span className="text-brand-gradient">tres protagonistas.</span>
            </>
          }
          description="GOGO conecta personas, restaurantes y repartidores en una sola plataforma. Cada pedido pone en movimiento a los tres."
          className="mx-auto max-w-3xl"
        />

        {/* Nodos del ecosistema */}
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-3 lg:gap-6" as="ul">
          {nodes.map((node) => (
            <RevealItem key={node.label} as="li">
              <div
                className="group relative flex h-full flex-col items-center gap-3 rounded-2xl border border-border
                           bg-white/70 px-5 py-7 text-center transition-all duration-500 ease-gogo
                           hover:-translate-y-1.5 hover:border-primary/35 hover:bg-white hover:shadow-card"
              >
                <span
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-fg
                             shadow-[0_10px_24px_rgb(var(--color-primary)/0.3)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl bg-primary/40 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <node.icon className="relative h-6 w-6" aria-hidden />
                </span>
                <span className="font-display text-lg font-black tracking-tight">{node.label}</span>
                <span className="text-sm text-muted">{node.detail}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Flujo del pedido */}
        <Reveal delay={0.15} className="mt-12">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/15 bg-white/75 p-6 sm:p-8">
            <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted">
              El recorrido de un pedido
            </p>
            <ol className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {[
                "El usuario realiza el pedido",
                "El restaurante lo prepara",
                "El repartidor lo recoge",
                "El usuario lo recibe",
              ].map((step, i, arr) => (
                <li key={step} className="flex flex-1 items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-soft sm:h-full sm:flex-col sm:gap-2 sm:text-center">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground">{step}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <>
                      <ArrowDown className="h-4 w-4 shrink-0 text-primary/50 sm:hidden" aria-hidden />
                      <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary/50 sm:block" aria-hidden />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
