"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CTAButton } from "@/components/ui/Button";

/** Cabecera común de cada paso del asistente. */
export function StepHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <header className="flex items-start gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <h2 className="font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </header>
  );
}

/**
 * Botonera inferior del paso.
 * En móvil los botones ocupan todo el ancho y el de avanzar va arriba, que es
 * la acción principal y la que queda bajo el pulgar.
 */
export function StepActions({
  onBack,
  nextLabel = "Continuar",
  nextDisabled,
  loading,
  children,
}: {
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  /** Contenido extra encima de los botones (avisos, casillas...). */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onBack && (
          <CTAButton type="button" variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Atrás
          </CTAButton>
        )}
        <CTAButton type="submit" size="lg" disabled={nextDisabled || loading}>
          {nextLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
            aria-hidden
          />
        </CTAButton>
      </div>
    </div>
  );
}
