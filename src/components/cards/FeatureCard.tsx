import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Tarjeta genérica de característica o beneficio. */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  tone = "light",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group h-full rounded-2xl border p-5 transition-all duration-400 ease-gogo sm:p-6",
        tone === "dark"
          ? "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
          : "border-border bg-background hover:-translate-y-1 hover:border-primary/30 hover:shadow-card",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-400 ease-gogo group-hover:scale-110",
          tone === "dark" ? "bg-primary/20 text-primary-soft" : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
      <h3
        className={cn(
          "mt-4 font-display text-base font-black tracking-tight sm:text-lg",
          tone === "dark" ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h3>
      <p className={cn("mt-2 text-sm leading-relaxed", tone === "dark" ? "text-white/60" : "text-muted")}>
        {description}
      </p>
    </article>
  );
}
