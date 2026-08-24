import { Bike, Check, Clock } from "lucide-react";
import { driverOnboarding, driverRequirements } from "@/data/drivers";
import { SectionTitle, PendingTag } from "@/components/ui/SectionTitle";
import { InlineLogo } from "@/components/ui/Logo";
import { CTAButton } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

/**
 * Sección para repartidores.
 * No se prometen ingresos, horarios, bonos ni condiciones laborales:
 * los requisitos aún no definidos se muestran marcados como pendientes.
 */
export function DriverSection() {
  return (
    <section id="repartidores" className="relative overflow-hidden bg-brand-deep text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-45" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[110px]"
      />

      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <SectionTitle
              align="left"
              tone="dark"
              eyebrow="Repartidores"
              title={
                <>
                  Tu moto. Tu tiempo.{" "}
                  <span className="text-brand-gradient">Tu oportunidad.</span>
                </>
              }
              description="Regístrate con tu motocicleta, recibe solicitudes de entrega desde la app y genera ingresos realizando repartos."
            />

            <Reveal delay={0.15} className="mt-8">
              <CTAButton href="/repartidores" size="lg">
                <Bike className="h-5 w-5" aria-hidden />
                Quiero ser repartidor
              </CTAButton>
            </Reveal>

            {/* Requisitos */}
            <Reveal delay={0.2} className="mt-10">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Qué necesitas
                </p>
                <ul className="mt-5 space-y-3">
                  {driverRequirements.map((r) => (
                    <li key={r.label} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                          r.pending ? "bg-white/10 text-white/50" : "bg-primary/20 text-primary-soft",
                        )}
                      >
                        {r.pending ? (
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        )}
                      </span>
                      <span className={cn("text-sm", r.pending ? "text-white/55" : "text-white/85")}>
                        {r.label}
                      </span>
                      {r.pending && (
                        <span className="ml-auto rounded-pill border border-dashed border-white/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                          Por definir
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/45">
                  Los requisitos marcados como &laquo;por definir&raquo; se publicarán aquí cuando estén
                  confirmados. <InlineLogo variant="plain" /> no promete ingresos, horarios ni
                  condiciones que todavía no existen.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Cómo empezar */}
          <div>
            <h3 className="font-display text-xl font-black tracking-tight text-white sm:text-2xl">
              ¿Cómo empezar?
            </h3>
            <RevealGroup className="mt-6 space-y-3" as="ol" stagger={0.07}>
              {driverOnboarding.map((s) => (
                <RevealItem key={s.step} as="li">
                  <div
                    className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all
                               duration-400 ease-gogo hover:border-primary/40 hover:bg-white/[0.06] sm:p-5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black
                                 text-primary-fg transition-transform duration-400 ease-gogo group-hover:scale-110"
                    >
                      {s.step}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-base font-black tracking-tight text-white">
                          {s.title}
                        </h4>
                        {s.pending && <PendingTag>Requisitos por definir</PendingTag>}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{s.description}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
