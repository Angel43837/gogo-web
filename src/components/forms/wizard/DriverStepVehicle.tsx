"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { vehicleTypes } from "@/data/driverRegistration";
import { driverStep3Schema, type DriverStep3 } from "@/lib/driverRegistration";
import { cn } from "@/lib/utils";

/**
 * Paso 3 — medio de transporte.
 * Solo sirve para decidir qué pedidos y zonas encajan contigo.
 * No se piden licencia, tarjeta de circulación ni papeles del vehículo.
 */
export function DriverStepVehicle({
  defaults,
  onNext,
  onBack,
}: {
  defaults: Partial<DriverStep3>;
  onNext: (values: DriverStep3) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<DriverStep3>({
    resolver: zodResolver(driverStep3Schema),
    mode: "onChange",
    defaultValues: { ...defaults },
  });

  const selected = watch("vehicle");

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={Bike}
        title="¿Cómo realizarás tus entregas?"
        description="Elige el medio que usarás habitualmente. Podrás cambiarlo después desde la app."
      />

      <div className="flex flex-col gap-4">
        <fieldset className="border-0 p-0">
          <legend className="sr-only">Medio de transporte</legend>
          <div className="grid gap-3">
            {vehicleTypes.map((vehicle) => {
              const active = selected === vehicle.value;
              return (
                <label
                  key={vehicle.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-white hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    value={vehicle.value}
                    className="sr-only"
                    {...register("vehicle")}
                  />
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                      active ? "bg-primary text-white" : "bg-primary/10 text-primary",
                    )}
                    aria-hidden
                  >
                    <vehicle.icon className="h-7 w-7" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-black tracking-tight text-foreground">
                      {vehicle.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{vehicle.detail}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active ? "border-primary bg-primary" : "border-border bg-white",
                    )}
                    aria-hidden
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.vehicle?.message && (
            <p className="mt-2 text-xs font-medium text-red-600">{errors.vehicle.message}</p>
          )}
        </fieldset>

        <p className="flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            No te pedimos licencia de conducir, tarjeta de circulación ni papeles del vehículo. El
            medio de transporte solo se usa para asignarte los pedidos y zonas que te convienen.
          </span>
        </p>
      </div>

      <StepActions onBack={onBack} nextDisabled={!isValid} />
    </form>
  );
}
