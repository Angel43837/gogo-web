"use client";

import { AlertTriangle } from "lucide-react";
import { FormCard } from "@/components/forms/FormShell";
import { restaurantStatuses, type RestaurantStatus } from "@/data/restaurantRegistration";
import { cn } from "@/lib/utils";

/**
 * Ciclo de vida del restaurante dentro de la plataforma.
 *
 * "Requiere corrección" y "Rechazado" son desvíos del camino normal, así que
 * se muestran aparte y no como un paso más de la secuencia.
 */
const mainFlow: RestaurantStatus[] = [
  "registro_iniciado",
  "registro_completado",
  "en_revision",
  "aprobado",
  "activo",
];

export function StatusTimeline({
  current,
  /** Motivos a corregir, cuando el estado es "requiere_correccion". */
  corrections,
}: {
  current: RestaurantStatus;
  corrections?: string[];
}) {
  const currentIndex = mainFlow.indexOf(current);
  const offTrack = current === "requiere_correccion" || current === "rechazado";
  const detours = restaurantStatuses.filter(
    (s) => s.id === "requiere_correccion" || s.id === "rechazado",
  );

  return (
    <FormCard className="!p-5 sm:!p-6">
      <h3 className="font-display text-base font-black tracking-tight text-foreground">
        Estado de tu solicitud
      </h3>
      <p className="mt-1 text-sm text-muted">
        Así avanza tu restaurante hasta quedar activo en GOGO.
      </p>

      <ol className="mt-5 space-y-3">
        {mainFlow.map((id, i) => {
          const status = restaurantStatuses.find((s) => s.id === id)!;
          const done = !offTrack && i < currentIndex;
          const active = !offTrack && i === currentIndex;

          return (
            <li key={id} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    done && "border-primary bg-primary text-primary-fg",
                    active && "border-primary bg-white text-primary ring-4 ring-primary/15",
                    !done && !active && "border-border bg-white text-muted",
                  )}
                >
                  <status.icon className="h-4 w-4" aria-hidden />
                </span>
                {i < mainFlow.length - 1 && (
                  <span
                    className={cn(
                      "mt-1 w-0.5 flex-1 rounded-pill",
                      done ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>

              <div className="pb-3">
                <p
                  className={cn(
                    "text-sm font-bold",
                    active ? "text-primary" : done ? "text-foreground" : "text-muted",
                  )}
                >
                  {status.label}
                  {active && (
                    <span className="ml-2 rounded-pill bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary">
                      Actual
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{status.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Requiere corrección: se detalla qué hay que arreglar */}
      {current === "requiere_correccion" && (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-orange-800">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Hay información que debes corregir
          </p>
          {corrections?.length ? (
            <ul className="mt-2.5 space-y-1.5">
              {corrections.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-orange-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-orange-900">
              Te enviaremos por correo el detalle de lo que hay que ajustar.
            </p>
          )}
        </div>
      )}

      {/* Desvíos posibles del proceso */}
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Otros estados posibles
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {detours.map((status) => (
            <span
              key={status.id}
              title={status.description}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold",
                status.tone,
                current === status.id && "ring-2 ring-offset-1",
              )}
            >
              <status.icon className="h-3.5 w-3.5" aria-hidden />
              {status.label}
            </span>
          ))}
        </div>
      </div>
    </FormCard>
  );
}
