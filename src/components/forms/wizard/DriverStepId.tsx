"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Lock, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field } from "@/components/forms/Field";
import { ImageUploader } from "@/components/forms/wizard/ImageUploader";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import {
  idGuidelines,
  idTypes,
  proofOfAddressGuideline,
  proofOfAddressTypes,
} from "@/data/driverRegistration";
import { driverStep4Schema, type DriverStep4 } from "@/lib/driverRegistration";
import type { PickedImage } from "@/lib/restaurantRegistration";
import { cn } from "@/lib/utils";

/**
 * Paso 4 — identificación oficial.
 *
 * Aquí se recogen datos personales sensibles, así que se explica para qué se
 * usan y se recuerda que no se comparten con clientes ni restaurantes.
 */
export function DriverStepId({
  defaults,
  front,
  back,
  proof,
  onFront,
  onBack_,
  onProof,
  onNext,
  onBack,
}: {
  defaults: Partial<DriverStep4>;
  front: PickedImage | null;
  back: PickedImage | null;
  proof: PickedImage | null;
  onFront: (image: PickedImage | null) => void;
  /** Cambia la foto del reverso. */
  onBack_: (image: PickedImage | null) => void;
  onProof: (image: PickedImage | null) => void;
  onNext: (values: DriverStep4) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<DriverStep4>({
    resolver: zodResolver(driverStep4Schema),
    mode: "onChange",
    defaultValues: { idNumber: "", ...defaults },
  });

  const selected = watch("idType");
  // Sin las dos caras del documento y el comprobante no se puede verificar.
  const canContinue = isValid && Boolean(front) && Boolean(back) && Boolean(proof);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={IdCard}
        title="Identificación y domicilio"
        description="Necesitamos verificar quién eres y dónde vives antes de activar tu cuenta."
      />

      <div className="flex flex-col gap-5">
        {/* Tipo de documento */}
        <fieldset className="border-0 p-0">
          <legend className="mb-2 p-0 text-sm font-bold text-foreground">
            Tipo de identificación <span className="text-primary">*</span>
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {idTypes.map((type) => {
              const active = selected === type.value;
              return (
                <label
                  key={type.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3.5 transition-all duration-200",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-primary/40",
                  )}
                >
                  <input type="radio" value={type.value} className="sr-only" {...register("idType")} />
                  <span className="text-sm font-bold text-foreground">{type.label}</span>
                  <span className="text-xs text-muted">{type.detail}</span>
                </label>
              );
            })}
          </div>
          {errors.idType?.message && (
            <p className="mt-2 text-xs font-medium text-red-600">{errors.idType.message}</p>
          )}
        </fieldset>

        <Field
          label="Número de la identificación"
          required
          icon={IdCard}
          placeholder="Como aparece en el documento"
          hint="En el INE es la clave de elector; en el pasaporte, el número del documento."
          error={errors.idNumber?.message}
          {...register("idNumber")}
        />

        {/* Fotografías del documento */}
        <div className="flex flex-col gap-4">
          <ImageUploader
            kind="document"
            guideline={idGuidelines.front}
            value={front}
            onChange={onFront}
            optional={false}
          />
          <ImageUploader
            kind="document"
            guideline={idGuidelines.back}
            value={back}
            onChange={onBack_}
            optional={false}
          />
        </div>

        {/* Comprobante de domicilio */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">
              Comprobante de domicilio <span className="text-primary">*</span>
            </p>
            <p className="mt-1 text-xs text-muted">Sirve cualquiera de estos:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {proofOfAddressTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-pill bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <ImageUploader
            kind="document"
            guideline={proofOfAddressGuideline}
            value={proof}
            onChange={onProof}
            optional={false}
          />
        </div>

        {/* Uso de los datos */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Lock className="h-4 w-4 text-primary" aria-hidden />
            Qué hacemos con tu identificación
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Se usan únicamente para verificar tu identidad y tu domicilio antes de activarte.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              No se comparte con clientes ni con restaurantes.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              No aparece en tu perfil público dentro de la app.
            </li>
          </ul>
          <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted">
            El plazo de conservación y el tratamiento completo de estos datos se detallarán en el
            aviso de privacidad, actualmente en preparación.
          </p>
        </div>

        {!canContinue && (
          <p className="flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              Para continuar necesitamos el tipo, el número, las <strong>dos caras</strong> de tu
              identificación y el <strong>comprobante de domicilio</strong>.
            </span>
          </p>
        )}
      </div>

      <StepActions onBack={onBack} nextDisabled={!canContinue} />
    </form>
  );
}
