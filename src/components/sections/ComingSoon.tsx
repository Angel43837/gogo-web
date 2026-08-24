import { Construction } from "lucide-react";
import type { ReactNode } from "react";
import { CTAButton } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Bloque para rutas cuya funcionalidad (formulario, funnel, contenido legal)
 * todavía no está definida. Evita publicar información inventada.
 */
export function ComingSoon({
  title,
  description,
  note,
  children,
}: {
  title: string;
  description: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-tint">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-dashed border-primary/40 bg-white p-7 text-center sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Construction className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
            {note && <div className="mt-6 text-sm text-muted">{note}</div>}
            {children}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CTAButton href="/" variant="outline">
                Volver al inicio
              </CTAButton>
              <CTAButton href="/faq" variant="ghost">
                Ver preguntas frecuentes
              </CTAButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
