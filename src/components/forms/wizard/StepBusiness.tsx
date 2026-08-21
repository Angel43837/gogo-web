"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Info, UtensilsCrossed } from "lucide-react";
import { useForm } from "react-hook-form";
import { SelectField, TextareaField } from "@/components/forms/Field";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { businessModalities, establishmentTypes, weekDays } from "@/data/restaurantRegistration";
import { step3Schema, type Step3 } from "@/lib/restaurantRegistration";
import { cn } from "@/lib/utils";

/** Paso 3 — lo indispensable para crear el perfil inicial. */
export function StepBusiness({
  defaults,
  onNext,
  onBack,
}: {
  defaults: Partial<Step3>;
  onNext: (values: Step3) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
    defaultValues: {
      description: "",
      openDays: ["lun", "mar", "mie", "jue", "vie", "sab"],
      openTime: "09:00",
      closeTime: "22:00",
      ...defaults,
    },
  });

  const openDays = watch("openDays") ?? [];
  const description = watch("description") ?? "";
  const establishmentType = watch("establishmentType");

  const toggleDay = (value: string) =>
    setValue(
      "openDays",
      openDays.includes(value) ? openDays.filter((d) => d !== value) : [...openDays, value],
      { shouldValidate: true },
    );

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={UtensilsCrossed}
        title="Información del negocio"
        description="Solo lo indispensable para crear tu perfil. El menú, los productos y los precios se cargan después, desde la app."
      />

      <div className="flex flex-col gap-5">
        {/* Tipo de establecimiento */}
        <fieldset className="border-0 p-0">
          <legend className="mb-2 p-0 text-sm font-bold text-foreground">
            Tipo de establecimiento <span className="text-primary">*</span>
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {establishmentTypes.map((type) => {
              const active = establishmentType === type.value;
              return (
                <label
                  key={type.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3.5 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    value={type.value}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    {...register("establishmentType")}
                  />
                  <span>
                    <span className="block text-sm font-bold text-foreground">{type.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{type.detail}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.establishmentType?.message && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errors.establishmentType.message}
            </p>
          )}
        </fieldset>

        <SelectField
          label="Modalidad del negocio"
          required
          placeholder="Elige la modalidad"
          options={businessModalities}
          error={errors.modality?.message}
          {...register("modality")}
        />

        <div>
          <TextareaField
            label="Descripción breve"
            required
            rows={4}
            maxLength={280}
            placeholder="¿Qué te hace distinto? Ej. Tacos al pastor de trompo tradicional, receta familiar desde 1998."
            error={errors.description?.message}
            {...register("description")}
          />
          <p className="mt-1 text-right text-xs text-muted">{description.length}/280</p>
        </div>

        {/* Horario habitual */}
        <fieldset className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <legend className="flex items-center gap-2 p-0 text-sm font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" aria-hidden />
            Horario habitual de atención
          </legend>

          <div className="mt-4 flex flex-wrap gap-2">
            {weekDays.map((day) => {
              const active = openDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  aria-pressed={active}
                  aria-label={day.full}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-200",
                    active
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-border bg-white text-muted hover:border-primary/40",
                  )}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
          {errors.openDays?.message && (
            <p className="mt-2 text-xs font-medium text-red-600">{errors.openDays.message}</p>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="openTime" className="text-sm font-bold text-foreground">
                Abre a las
              </label>
              <input
                id="openTime"
                type="time"
                className="h-12 w-full rounded-xl border border-border bg-white px-3.5 text-[0.95rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
                {...register("openTime")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="closeTime" className="text-sm font-bold text-foreground">
                Cierra a las
              </label>
              <input
                id="closeTime"
                type="time"
                className="h-12 w-full rounded-xl border border-border bg-white px-3.5 text-[0.95rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
                {...register("closeTime")}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted">
            Podrás afinar el horario por día desde la app de restaurantes.
          </p>
        </fieldset>

        <p className="flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            En este registro no pedimos RFC, documentos fiscales, menú, productos ni precios. Todo
            eso se completa después desde la aplicación para restaurantes.
          </span>
        </p>
      </div>

      <StepActions onBack={onBack} nextDisabled={!isValid} />
    </form>
  );
}
