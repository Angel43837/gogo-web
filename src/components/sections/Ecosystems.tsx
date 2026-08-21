import { ecosystems } from "@/data/ecosystems";
import { EcosystemCard } from "@/components/cards/EcosystemCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealGroup, RevealItem } from "@/components/animations/Reveal";

/** Los tres ecosistemas: usuarios, restaurantes y repartidores. */
export function Ecosystems() {
  return (
    <section id="ecosistemas" className="relative overflow-hidden bg-brand">
      <div className="section-shell">
        <SectionTitle
          tone="brand"
          eyebrow="Tres formas de participar"
          title={
            <>
              Elige cómo quieres <span className="text-brand-gradient-light">moverte con GOGO</span>
            </>
          }
          description="Pide lo que se te antoje, lleva tu restaurante más lejos o convierte tu moto en una fuente de ingresos."
          className="mx-auto max-w-3xl"
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" as="ul" stagger={0.1}>
          {ecosystems.map((item, i) => (
            <RevealItem key={item.id} as="li" className="md:last:col-span-2 lg:last:col-span-1">
              <EcosystemCard item={item} featured={i === 0} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
