import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { Ecosystem } from "@/data/ecosystems";
import { cn } from "@/lib/utils";

/** Tarjeta de uno de los tres ecosistemas: usuarios, restaurantes o repartidores. */
export function EcosystemCard({ item, featured }: { item: Ecosystem; featured?: boolean }) {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-500 ease-gogo sm:p-7",
        "hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 focus-within:shadow-lift",
        featured
          ? "border-white bg-white ring-4 ring-white/25"
          : "border-white/70 bg-white/95 hover:bg-white",
      )}
    >
      {/* Halo naranja al hacer hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/12 opacity-0 blur-2xl
                   transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-center justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-fg
                     shadow-[0_8px_20px_rgb(var(--color-primary)/0.3)] transition-transform duration-500 ease-gogo
                     group-hover:-rotate-6 group-hover:scale-110"
        >
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{item.eyebrow}</span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-black leading-tight tracking-tight text-foreground sm:text-2xl">
        {item.claim}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

      <ul className="relative mt-5 space-y-2.5 border-t border-border pt-5">
        {item.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-6">
        <Link
          href={item.cta.href}
          className="inline-flex items-center gap-2 rounded-pill text-sm font-bold text-primary transition-colors hover:text-primary-dark"
        >
          {item.cta.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-gogo group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
