"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/ui/Button";
import { FormCard } from "@/components/forms/FormShell";
import { InlineLogo } from "@/components/ui/Logo";

/** Pantalla de confirmación tras completar un registro. */
export function SuccessPanel({
  icon: Icon,
  title,
  highlight,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  /** Dato propio del registro (nombre del restaurante, del rider…). */
  highlight?: string;
  description: string;
  actionLabel: string;
  /** `null` cuando todavía no existe la URL de destino: no se inventa. */
  actionHref: string | null;
}) {
  return (
    <FormCard className="text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-fg shadow-[0_12px_30px_rgb(var(--color-primary)/0.32)]">
        <Icon className="h-9 w-9" aria-hidden />
      </span>

      <h2 className="mt-7 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>

      {highlight && (
        <p className="mt-4 text-base text-muted">
          <span className="font-bold text-foreground">{highlight}</span> ya está en{" "}
          <InlineLogo word="food" />
        </p>
      )}

      <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted">{description}</p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {actionHref ? (
          <CTAButton href={actionHref} size="lg">
            {actionLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              aria-hidden
            />
          </CTAButton>
        ) : (
          <CTAButton href="/" size="lg">
            Volver al inicio
          </CTAButton>
        )}
        <CTAButton href="/" variant="outline" size="lg">
          Ir a la web de GOGO
        </CTAButton>
      </div>
    </FormCard>
  );
}
