"use client";

import { ImageIcon, Info } from "lucide-react";
import { ImageUploader } from "@/components/forms/wizard/ImageUploader";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { imageGuidelines } from "@/data/restaurantRegistration";
import type { PickedImage } from "@/lib/restaurantRegistration";

/** Paso 4 — logo y portada. Ninguno es obligatorio para enviar el registro. */
export function StepImages({
  logo,
  cover,
  onLogo,
  onCover,
  onNext,
  onBack,
}: {
  logo: PickedImage | null;
  cover: PickedImage | null;
  onLogo: (image: PickedImage | null) => void;
  onCover: (image: PickedImage | null) => void;
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
        icon={ImageIcon}
        title="Logo e imagen del restaurante"
        description="Son la primera impresión de tu negocio en la app. Puedes añadirlas ahora o más tarde."
      />

      <div className="flex flex-col gap-4">
        <ImageUploader kind="logo" guideline={imageGuidelines.logo} value={logo} onChange={onLogo} />
        <ImageUploader
          kind="cover"
          guideline={imageGuidelines.cover}
          value={cover}
          onChange={onCover}
        />

        <p className="flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            No hace falta subir fotos de cada platillo aquí. El menú y las imágenes de los
            productos se cargan desde la aplicación para restaurantes, una vez aprobada tu cuenta.
          </span>
        </p>
      </div>

      <StepActions onBack={onBack} nextLabel="Revisar registro" />
    </form>
  );
}
