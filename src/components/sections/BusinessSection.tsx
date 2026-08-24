import { ArrowRight, Store } from "lucide-react";
import { businessBenefits, businessOnboarding } from "@/data/businesses";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InlineLogo } from "@/components/ui/Logo";
import { CTAButton } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";

/** Sección de conversión para restaurantes. Sin comisiones, precios ni cifras: aún no están definidas. */
export function BusinessSection() {
  return (
    <section id="restaurantes" className="relative bg-brand-tint">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionTitle
              align="left"
              eyebrow="Restaurantes"
              title={
                <>
                  Tu restaurante merece{" "}
                  <span className="text-brand-gradient">llegar más lejos.</span>
                </>
              }
              description={
                <>
                  Publica tu carta, recibe pedidos y apóyate en la red de repartidores{" "}
                  <InlineLogo />. Tú te concentras en preparar; nosotros movemos el resto.
                </>
              }
            />

            <Reveal delay={0.15} className="mt-8">
              <CTAButton href="/restaurantes" size="lg">
                <Store className="h-5 w-5" aria-hidden />
                Registra tu restaurante
              </CTAButton>
            </Reveal>

            {/* Pasos de alta */}
            <Reveal delay={0.2} className="mt-10">
              <div className="rounded-3xl border border-primary/15 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Cómo se suma un restaurante
                </p>
                <ol className="mt-5 space-y-4">
                  {businessOnboarding.map((s) => (
                    <li key={s.step} className="flex gap-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                        {s.step}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-foreground">{s.title}</span>
                        <span className="mt-0.5 block text-sm text-muted">{s.description}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="grid gap-4 sm:grid-cols-2" as="ul">
            {businessBenefits.map((b, i) => (
              <RevealItem
                key={b.title}
                as="li"
                className={i === businessBenefits.length - 1 ? "sm:col-span-2" : undefined}
              >
                <FeatureCard icon={b.icon} title={b.title} description={b.description} />
              </RevealItem>
            ))}
            <RevealItem as="li" className="sm:col-span-2">
              <div className="bg-brand flex flex-col items-start gap-4 rounded-2xl p-6 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-sm font-medium leading-relaxed text-onBrand">
                  ¿Listo para que más personas encuentren tu restaurante dentro de{" "}
                  <InlineLogo variant="dark" />?
                </p>
                <CTAButton href="/restaurantes" variant="onBrand" size="md" className="shrink-0">
                  Registra tu restaurante
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
                </CTAButton>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
