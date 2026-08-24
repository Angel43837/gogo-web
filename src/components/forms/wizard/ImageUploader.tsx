"use client";

/* eslint-disable @next/next/no-img-element */

import { AlertCircle, Check, ImagePlus, Trash2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { imageLimits } from "@/data/restaurantRegistration";
import type { PickedImage } from "@/lib/restaurantRegistration";
import { cn } from "@/lib/utils";

/*
 * Las vistas previas son DataURL locales, no URLs remotas, así que `next/image`
 * no aporta nada aquí (no hay optimización posible) y complicaría el layout.
 * Por eso la regla de ESLint queda desactivada arriba a propósito.
 */

type Guideline = {
  title: string;
  hint: string;
  do: readonly string[];
  dont: readonly string[];
};

/** Lee el archivo y mide sus dimensiones reales antes de aceptarlo. */
function readImage(file: File): Promise<PickedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const preview = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no es una imagen válida"));
      img.onload = () =>
        resolve({
          name: file.name,
          size: file.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          preview,
        });
      img.src = preview;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  kind,
  guideline,
  value,
  onChange,
  optional = true,
}: {
  /** `profile` se comporta como `logo`: cuadrada y del mismo tamaño mínimo. */
  kind: "logo" | "cover" | "profile" | "document";
  guideline: Guideline;
  value: PickedImage | null;
  onChange: (image: PickedImage | null) => void;
  optional?: boolean;
}) {
  // Portadas y documentos son horizontales; logos y fotos de perfil, cuadrados.
  const square = kind !== "cover" && kind !== "document";
  const wide = !square;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!imageLimits.accept.includes(file.type as (typeof imageLimits.accept)[number])) {
      setError("Formato no admitido. Usa PNG, JPG o WebP.");
      return;
    }
    if (file.size > imageLimits.maxBytes) {
      setError(`La imagen pesa demasiado. Máximo ${imageLimits.maxBytes / 1048576} MB.`);
      return;
    }

    try {
      const image = await readImage(file);

      if (square && Math.min(image.width, image.height) < imageLimits.minLogo) {
        setError(
          `La imagen es muy pequeña (${image.width}×${image.height}). Mínimo ${imageLimits.minLogo}×${imageLimits.minLogo} px.`,
        );
        return;
      }
      if (wide && image.width < imageLimits.minCoverWidth) {
        setError(
          `La imagen es muy pequeña (${image.width} px de ancho). Mínimo ${imageLimits.minCoverWidth} px.`,
        );
        return;
      }

      onChange(image);
    } catch {
      setError("No se pudo procesar la imagen. Prueba con otro archivo.");
    }
  };

  const ratio = value ? value.width / value.height : 0;
  const warnRatio =
    value &&
    ((square && (ratio < 0.8 || ratio > 1.25)) ||
      (wide && ratio < 1.3));

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-base font-black tracking-tight text-foreground">
            {guideline.title}
          </h4>
          <p className="mt-0.5 text-xs text-muted">{guideline.hint}</p>
        </div>
        {optional && (
          <span className="shrink-0 rounded-pill bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
            Opcional
          </span>
        )}
      </div>

      {/* Zona de carga o vista previa */}
      {value ? (
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-xl border border-border bg-surface",
              square ? "h-20 w-20" : "h-20 w-32",
              kind === "profile" && "rounded-full",
            )}
          >
            <img src={value.preview} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{value.name}</p>
            <p className="mt-0.5 text-xs text-muted">
              {value.width} × {value.height} px · {(value.size / 1024).toFixed(0)} KB
            </p>
            {warnRatio && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {square
                  ? "Se recomienda una imagen cuadrada; esta se recortará."
                  : "Se recomienda formato horizontal; esta se recortará."}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={`Quitar ${guideline.title.toLowerCase()}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface",
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ImagePlus className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-sm font-bold text-foreground">Arrastra la imagen o toca aquí</span>
          <span className="text-xs text-muted">PNG, JPG o WebP · máximo 5 MB</span>
        </label>
      )}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={imageLimits.accept.join(",")}
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {/* Recomendaciones */}
      <div className="grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
        <ul className="space-y-1.5">
          {guideline.do.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-foreground/80">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5">
          {guideline.dont.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-muted">
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
