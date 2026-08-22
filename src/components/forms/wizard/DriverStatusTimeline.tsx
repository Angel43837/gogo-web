"use client";

import { AlertTriangle } from "lucide-react";
import { FormCard } from "@/components/forms/FormShell";
import {
  driverMainFlow,
  driverStatuses,
  type DriverStatus,
} from "@/data/driverRegistration";
import { availabilityStates } from "@/data/driverOperations";
import { cn } from "@/lib/utils";

/**
 * Ciclo de vida del repartidor.
 * "Requiere corrección", "Suspendido" y "Desactivado" son desvíos del camino
 * normal, así que se muestran aparte y no como un paso más de la secuencia.
 */
export function DriverStatusTimeline({
  current,
  corrections,
}: {
  current: DriverStatus;
  corrections?: string[];
}) {
  const currentIndex = driverMainFlow.indexOf(current);
  const offTrack = !driverMainFlow.includes(current);
  const detours = driverStatuses.filter((s) => !driverMainFlow.includes(s.id));

  return (
    <FormCard className="!p-5 sm:!p-6">
      <h3 className="font-display text-base font-black tracking-tight text-foreground">
        Estado de tu cuenta
      </h3>
      <p className="mt-1 text-sm text-muted">
        Así avanza tu solicitud hasta que puedas conectarte y recibir pedidos.
      </p>

      <ol className="mt-5 space-y-3">
        {driverMainFlow.map((id, i) => {
          const status = driverStatuses.find((s) => s.id === id)!;
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
                {i < driverMainFlow.length - 1 && (
                  <span
                    className={cn("mt-1 w-0.5 flex-1 rounded-pill", done ? "bg-primary" : "bg-border")}
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

      {/* Qué pasa una vez activo */}
      <div className="mt-5 rounded-2xl bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Cuando tu cuenta esté activa
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Desde la app podrás cambiar tu disponibilidad cuando quieras:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {availabilityStates.map((state) => (
            <span
              key={state.id}
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-white px-3 py-1.5 text-xs font-bold text-foreground"
            >
              <span aria-hidden>{state.indicator}</span>
              {state.label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Solo compartes tu ubicación mientras estás <strong>Disponible</strong>. Al desconectarte,
          deja de compartirse.
        </p>
      </div>
    </FormCard>
  );
}
