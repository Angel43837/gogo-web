import type { Bonus } from "@/data/bonuses";
import { PendingTag } from "@/components/ui/SectionTitle";

/**
 * Tarjeta de bono/promoción.
 * La estructura está lista, pero NO muestra cantidades ni condiciones:
 * los bonos todavía no están definidos.
 */
export function BonusCard({ bonus }: { bonus: Bonus }) {
  const Icon = bonus.icon;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-primary/30
                 bg-gradient-to-b from-primary/[0.05] to-white p-5 transition-all duration-400 ease-gogo
                 hover:-translate-y-1 hover:border-primary/60 hover:shadow-card sm:p-6"
    >
      {/* Muescas laterales tipo cupón */}
      <span aria-hidden className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-flame-tint2" />
      <span aria-hidden className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-flame-tint2" />

      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-400 group-hover:scale-110">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="rounded-pill bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
          {bonus.audience}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-black tracking-tight text-foreground sm:text-lg">
        {bonus.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{bonus.description}</p>

      <div className="mt-auto flex items-center gap-2 border-t border-dashed border-border pt-4">
        <PendingTag>Condiciones por definir</PendingTag>
      </div>
    </article>
  );
}
