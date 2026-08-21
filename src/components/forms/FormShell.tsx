"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Tarjeta blanca que contiene un formulario, sobre el naranja de marca. */
export function FormCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8 lg:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Encabezado de un bloque de campos dentro del formulario. */
export function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1 flex items-center gap-2.5 p-0">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        <span className="font-display text-lg font-black tracking-tight text-foreground">
          {title}
        </span>
      </legend>
      {description && <p className="mb-5 text-sm text-muted">{description}</p>}
      <div className={cn("flex flex-col gap-4", !description && "mt-5")}>{children}</div>
    </fieldset>
  );
}

/** Aviso de error del envío (no de validación de un campo concreto). */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Aviso de éxito en línea. */
export function FormSuccess({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Grupo de chips seleccionables (categorías del restaurante). */
export function ChipGroup({
  options,
  selected,
  onToggle,
  label,
  description,
  error,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  label: string;
  description?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {description && <p className="text-xs text-muted">{description}</p>}
      <div className="mt-1 flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-pill border px-3.5 py-2 text-sm font-semibold transition-all duration-200 ease-gogo",
                active
                  ? "border-primary bg-primary text-primary-fg shadow-[0_6px_16px_rgb(var(--color-primary)/0.28)]"
                  : "border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
