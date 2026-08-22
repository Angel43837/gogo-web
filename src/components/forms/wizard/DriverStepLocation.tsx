"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Info, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, SelectField } from "@/components/forms/Field";
import { LocationPicker } from "@/components/forms/wizard/LocationPicker";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { mexicanStates } from "@/data/restaurantRegistration";
import { driverStep2Schema, type DriverStep2 } from "@/lib/driverRegistration";

/**
 * Paso 2 — zona de operación.
 * No se pide el domicilio particular: para operar solo hace falta saber en qué
 * ciudad trabajará. La ubicación en tiempo real la pide la app, no la web.
 */
export function DriverStepLocation({
  defaults,
  onNext,
  onBack,
}: {
  defaults: Partial<DriverStep2>;
  onNext: (values: DriverStep2) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DriverStep2>({
    resolver: zodResolver(driverStep2Schema),
    mode: "onChange",
    defaultValues: { city: "", lat: null, lng: null, ...defaults },
  });

  const city = watch("city") ?? "";
  const state = watch("state");
  const lat = watch("lat");
  const lng = watch("lng");
  const coords = typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={MapPin}
        title="¿Dónde vas a repartir?"
        description="Con esto definimos tu zona de operación y qué pedidos te pueden llegar."
      />

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Ciudad"
            required
            icon={Building2}
            placeholder="Maravatío"
            error={errors.city?.message}
            {...register("city")}
          />
          <SelectField
            label="Estado"
            required
            placeholder="Elige tu estado"
            options={mexicanStates}
            error={errors.state?.message}
            {...register("state")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-foreground">
            Marca tu zona en el mapa{" "}
            <span className="font-medium text-muted">(opcional)</span>
          </span>
          <LocationPicker
            value={coords}
            address={[city, state].filter(Boolean).join(", ")}
            onChange={(next) => {
              setValue("lat", next.lat, { shouldValidate: true });
              setValue("lng", next.lng, { shouldValidate: true });
            }}
          />
        </div>

        <p className="flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            No te pedimos tu domicilio particular. Tu ubicación en tiempo real solo se comparte
            desde la app y <strong className="text-foreground">únicamente mientras estés
            conectado</strong>; al desconectarte deja de compartirse.
          </span>
        </p>
      </div>

      <StepActions onBack={onBack} nextDisabled={!isValid} />
    </form>
  );
}
