"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepMeta = { id: number; label: string; short: string };

/**
 * Indicador de progreso del registro.
 * En móvil se reduce a una barra con "Paso N de M" para no comerse la
 * pantalla; a partir de `sm` se muestran todos los pasos.
 */
export function Stepper({
  steps,
  current,
  furthest,
  onJump,
}: {
  steps: StepMeta[];
  current: number;
  /** Paso más avanzado alcanzado: solo se puede volver a los ya vistos. */
  furthest: number;
  onJump: (step: number) => void;
}) {
  const progress = ((current - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Móvil */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-black text-foreground">
            {steps[current - 1]?.label}
          </span>
          <span className="text-xs font-semibold text-muted">
            Paso {current} de {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-border">
          <div
            className="h-full rounded-pill bg-primary transition-[width] duration-500 ease-gogo"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>
      </div>

      {/* Escritorio */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, i) => {
          const done = step.id < current;
          const active = step.id === current;
          const reachable = step.id <= furthest;

          return (
            <li key={step.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                onClick={() => reachable && onJump(step.id)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-pill transition-opacity",
                  reachable ? "cursor-pointer" : "cursor-default opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-300 ease-gogo",
                    done && "border-primary bg-primary text-primary-fg",
                    active && "border-primary bg-white text-primary ring-4 ring-primary/15",
                    !done && !active && "border-border bg-white text-muted",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : step.id}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-bold lg:block",
                    active ? "text-foreground" : "text-muted",
                  )}
                >
                  {step.short}
                </span>
              </button>

              {i < steps.length - 1 && (
                <span className="mx-2 h-0.5 flex-1 overflow-hidden rounded-pill bg-border lg:mx-3">
                  <span
                    className={cn(
                      "block h-full origin-left rounded-pill bg-primary transition-transform duration-500 ease-gogo",
                      done ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
