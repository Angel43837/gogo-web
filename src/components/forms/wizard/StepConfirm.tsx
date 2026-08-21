"use client";

/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/forms/Field";
import { FormError } from "@/components/forms/FormShell";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { establishmentTypes, weekDays } from "@/data/restaurantRegistration";
import { step5Schema, type PickedImage, type Step1, type Step2, type Step3 } from "@/lib/restaurantRegistration";

type Confirm = { acceptTerms: true };

/** Fila de dato dentro del resumen. */
function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4 sm:py-1.5">
      <dt className="w-44 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

/** Bloque del resumen con su botón de edición. */
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

export function StepConfirm({
  step1,
  step2,
  step3,
  logo,
  cover,
  onEdit,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  step1: Step1;
  step2: Step2;
  step3: Step3;
  logo: PickedImage | null;
  cover: PickedImage | null;
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
  } = useForm<Confirm>({ resolver: zodResolver(step5Schema), mode: "onChange" });

  const establishment = establishmentTypes.find((t) => t.value === step3.establishmentType);
  const days = weekDays
    .filter((d) => step3.openDays.includes(d.value))
    .map((d) => d.full)
    .join(", ");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={ClipboardCheck}
        title="Revisa y confirma"
        description="Comprueba que todo esté correcto. Puedes editar cualquier sección antes de enviar."
      />

      <div className="flex flex-col gap-4">
        <Block title="Responsable" onEdit={() => onEdit(1)}>
          <Row label="Nombre" value={step1.ownerName} />
          <Row label="Teléfono" value={step1.ownerPhone} />
          <Row label="Correo" value={step1.email} />
        </Block>

        <Block title="Restaurante" onEdit={() => onEdit(2)}>
          <Row label="Nombre comercial" value={step2.restaurantName} />
          <Row label="Marca" value={step2.brandName} />
          <Row label="Categorías" value={step2.categories.join(", ")} />
          <Row label="Teléfono" value={step2.restaurantPhone} />
          <Row label="Dirección" value={step2.address} />
          <Row label="Ciudad" value={step2.city} />
          <Row label="Estado" value={step2.state} />
          <Row label="Código postal" value={step2.postalCode} />
          <Row
            label="Ubicación"
            value={
              typeof step2.lat === "number" && typeof step2.lng === "number"
                ? `${step2.lat.toFixed(5)}, ${step2.lng.toFixed(5)}`
                : "Sin marcar en el mapa"
            }
          />
        </Block>

        <Block title="Negocio" onEdit={() => onEdit(3)}>
          <Row label="Tipo" value={establishment?.label} />
          <Row label="Modalidad" value={step3.modality} />
          <Row label="Descripción" value={step3.description} />
          <Row label="Días" value={days} />
          <Row label="Horario" value={`${step3.openTime} a ${step3.closeTime}`} />
        </Block>

        <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-black tracking-tight text-foreground">
              Imágenes
            </h3>
            <button
              type="button"
              onClick={() => onEdit(4)}
              className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Editar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Logo</p>
              {logo ? (
                <img
                  src={logo.preview}
                  alt="Logo del restaurante"
                  className="h-20 w-20 rounded-xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted">
                  Sin logo
                </div>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Portada
              </p>
              {cover ? (
                <img
                  src={cover.preview}
                  alt="Portada del restaurante"
                  className="h-20 w-36 rounded-xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-36 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted">
                  Sin portada
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {error && <FormError>{error}</FormError>}

      <StepActions
        onBack={onBack}
        nextLabel={submitting ? "Enviando…" : "Enviar registro"}
        nextDisabled={!isValid}
        loading={submitting}
      >
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-4 sm:p-5">
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
                  href="/legal/politicas-restaurantes"
                  className="font-bold text-primary underline underline-offset-4"
                >
                  políticas para restaurantes
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
