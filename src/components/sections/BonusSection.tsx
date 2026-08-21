import { Info } from "lucide-react";
import { bonuses } from "@/data/bonuses";
import { BonusCard } from "@/components/cards/BonusCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealGroup, RevealItem, Reveal } from "@/components/animations/Reveal";

/**
 * Bonos y promociones.
 * Estructura visual lista; NO se publican cantidades ni condiciones
 * porque las promociones todavía no están definidas.
 */
export function BonusSection() {
  return (
    <section id="bonos" className="relative bg-brand-tint">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Bonos y promociones"
          title={
            <>
              Beneficios en camino para{" "}
              <span className="text-brand-gradient">todo el ecosistema</span>
            </>
          }
          description="Estamos definiendo los bonos y promociones de GOGO. Aquí es donde aparecerán en cuanto estén confirmados."
          className="mx-auto max-w-3xl"
        />

        <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl">
          <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-white p-4 text-left">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-muted">
              Todavía no hay promociones activas. No publicamos cantidades ni condiciones hasta que sean
              oficiales.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" as="ul">
          {bonuses.map((bonus) => (
            <RevealItem key={bonus.id} as="li">
              <BonusCard bonus={bonus} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
