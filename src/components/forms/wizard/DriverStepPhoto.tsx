"use client";

import { Info, UserCircle } from "lucide-react";
import { ImageUploader } from "@/components/forms/wizard/ImageUploader";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { photoGuideline } from "@/data/driverRegistration";
import type { PickedImage } from "@/lib/restaurantRegistration";

/**
 * Paso 4 — foto de perfil.
 * No es obligatoria para enviar el registro: se puede completar después desde
 * la app, pero se explica para qué sirve y qué se espera de ella.
 */
export function DriverStepPhoto({
  photo,
  onPhoto,
  onNext,
  onBack,
}: {
  photo: PickedImage | null;
  onPhoto: (image: PickedImage | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="flex flex-col gap-7"
    >
      <StepHeader
        icon={UserCircle}
        title="Tu foto de perfil"
        description="Sirve para que el restaurante y el cliente te identifiquen al llegar. Debe ser clara y de buena calidad."
      />

      <div className="flex flex-col gap-4">
        <ImageUploader kind="profile" guideline={photoGuideline} value={photo} onChange={onPhoto} />

        <p className="flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            Puedes continuar sin foto y añadirla más tarde desde la aplicación para repartidores,
            pero tu cuenta no podrá activarse hasta que tengas una.
          </span>
        </p>
      </div>

      <StepActions onBack={onBack} nextLabel="Revisar registro" />
    </form>
  );
}
