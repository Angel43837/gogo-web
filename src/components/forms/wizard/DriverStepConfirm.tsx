"use client";

/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Loader2, Pencil, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/forms/Field";
import { FormError } from "@/components/forms/FormShell";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { driverDisclaimer, idTypes, vehicleTypes } from "@/data/driverRegistration";
import { driverCommitments } from "@/data/drivers";
import type {
  DriverStep1,
  DriverStep2,
  DriverStep3,
  DriverStep4,
} from "@/lib/driverRegistration";
import { driverTermsSchema } from "@/lib/driverRegistration";
import type { PickedImage } from "@/lib/restaurantRegistration";

type Terms = { acceptTerms: true; acceptSafety: true; acceptDisclaimer: true };

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4 sm:py-1.5">
      <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

function Block({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-black tracking-tight text-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Editar
        </button>
      </div>
      <dl className="mt-3 divide-y divide-border">{children}</dl>
    </section>
  );
}

/** Paso 5 — resumen, reglas de seguridad y aceptación de términos. */
export function DriverStepConfirm({
  step1,
  step2,
  step3,
  step4,
  photo,
  idFront,
  idBack,
  onEdit,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  step1: DriverStep1;
  step2: DriverStep2;
  step3: DriverStep3;
  step4: DriverStep4;
  photo: PickedImage | null;
  idFront: PickedImage | null;
  idBack: PickedImage | null;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Terms>({ resolver: zodResolver(driverTermsSchema), mode: "onChange" });

  const vehicle = vehicleTypes.find((v) => v.value === step3.vehicle);
  const idType = idTypes.find((t) => t.value === step4.idType);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={ClipboardCheck}
        title="Revisa y confirma"
        description="Comprueba que todo esté correcto. Puedes editar cualquier sección antes de finalizar."
      />

      <div className="flex flex-col gap-4">
        <Block title="Datos personales" onEdit={() => onEdit(1)}>
          <Row label="Nombre" value={`${step1.firstName} ${step1.lastName}`} />
          <Row label="Teléfono" value={step1.phone} />
          <Row label="Correo" value={step1.email} />
        </Block>

        <Block title="Ubicación" onEdit={() => onEdit(2)}>
          <Row label="Ciudad" value={step2.city} />
          <Row label="Estado" value={step2.state} />
          <Row
            label="Zona marcada"
            value={
              typeof step2.lat === "number" && typeof step2.lng === "number"
                ? `${step2.lat.toFixed(5)}, ${step2.lng.toFixed(5)}`
                : "Sin marcar en el mapa"
            }
          />
        </Block>

        <Block title="Medio de transporte" onEdit={() => onEdit(3)}>
          <Row label="Vehículo" value={vehicle ? `${vehicle.emoji} ${vehicle.label}` : null} />
        </Block>

        <Block title="Identificación oficial" onEdit={() => onEdit(4)}>
          <Row label="Documento" value={idType?.label} />
          <Row label="Número" value={step4.idNumber} />
          <Row
            label="Fotografías"
            value={idFront && idBack ? "Frente y reverso cargados" : "Incompletas"}
          />
        </Block>

        <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-black tracking-tight text-foreground">
              Perfil
            </h3>
            <button
              type="button"
              onClick={() => onEdit(5)}
              className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Editar
            </button>
          </div>
          <div className="mt-4">
            {photo ? (
              <img
                src={photo.preview}
                alt="Foto de perfil del repartidor"
                className="h-24 w-24 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-border text-center text-xs text-muted">
                Sin foto
              </div>
            )}
          </div>
        </section>
      </div>

      {error && <FormError>{error}</FormError>}

      <StepActions
        onBack={onBack}
        nextLabel={submitting ? "Enviando…" : "Finalizar registro"}
        nextDisabled={!isValid}
        loading={submitting}
      >
        {/* Reglas de seguridad y comportamiento */}
        <div className="rounded-3xl border border-primary/25 bg-primary/[0.04] p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </span>
            <h3 className="font-display text-lg font-black tracking-tight text-foreground">
              Reglas de seguridad
            </h3>
          </div>

          <ul className="mt-4 space-y-3">
            {driverCommitments.map((commitment) => (
              <li key={commitment.id} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-soft">
                  <commitment.icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    {commitment.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                    {commitment.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-primary/20 pt-5">
            <Checkbox
              label={
                <>
                  Me comprometo a cumplir estas reglas en <strong>cada</strong> entrega.
                </>
              }
              error={errors.acceptSafety?.message}
              {...register("acceptSafety")}
            />
          </div>
        </div>

        {/* Deslinde de responsabilidad */}
        <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Scale className="h-4 w-4" aria-hidden />
            </span>
            <h3 className="font-display text-lg font-black tracking-tight text-foreground">
              Qué asume cada parte
            </h3>
          </div>
          <p className="mt-2 text-sm text-muted">
            Antes de continuar, lee con calma qué corre por tu cuenta al repartir con GOGO.
          </p>

          <ul className="mt-4 space-y-3">
            {driverDisclaimer.map((point) => (
              <li key={point.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{point.title}</span>
                    {point.needsLegalReview && (
                      <span className="rounded-pill border border-dashed border-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Por definir
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                    {point.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-amber-300 pt-5">
            <Checkbox
              label={
                <>
                  He leído y entiendo qué asume cada parte durante el reparto.
                </>
              }
              error={errors.acceptDisclaimer?.message}
              {...register("acceptDisclaimer")}
            />
          </div>
        </div>

        {/* Términos */}
        <div className="rounded-3xl border border-border bg-surface p-5">
          <Checkbox
            label={
              <>
                Declaro que la información proporcionada es correcta y acepto los{" "}
                <Link
                  href="/legal/terminos"
                  className="font-bold text-primary underline underline-offset-4"
                >
                  términos y condiciones
                </Link>
                , el{" "}
                <Link
                  href="/legal/privacidad"
                  className="font-bold text-primary underline underline-offset-4"
                >
                  aviso de privacidad
                </Link>{" "}
                y las{" "}
                <Link
                  href="/legal/politicas-repartidores"
                  className="font-bold text-primary underline underline-offset-4"
                >
                  políticas para repartidores
                </Link>{" "}
                de la plataforma.
              </>
            }
            error={errors.acceptTerms?.message}
            {...register("acceptTerms")}
          />
        </div>

        {submitting && (
          <p className="flex items-center justify-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Procesando tu registro…
          </p>
        )}
      </StepActions>
    </form>
  );
}
