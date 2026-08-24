import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Archivo del logotipo que se usa EN LÍNEA dentro de un texto.
 *
 * Ahora apunta al lockup apilado, que es el único horizontal-compatible que
 * hay en el proyecto. Cuando exista la versión horizontal (el "GOGO" en una
 * sola fila), guárdala como /logo/gogo-wordmark.svg y cambia solo esta línea:
 * se leerá mucho mejor al tamaño del texto.
 */
const INLINE_LOGO_SRC = "/logo/gogo-logo.svg";

type LogoProps = {
  /**
   * `badge`: el logotipo oficial sobre la placa naranja de marca (para fondos claros).
   * `light`: el logotipo tal cual, para fondos oscuros o naranjas.
   */
  variant?: "badge" | "light";
  className?: string;
  /** Alto del logotipo en px. */
  size?: number;
  href?: string | null;
  priority?: boolean;
};

/**
 * Logotipo oficial de GOGO FOOD.
 * Se usa siempre el archivo original: no se recolorea, no se recorta
 * y se mantiene su proporción con `object-contain`.
 */
export function Logo({ variant = "badge", className, size = 44, href = "/", priority }: LogoProps) {
  // Proporción del archivo original (312.08 × 361.54).
  const ratio = 312.08 / 361.54;
  const padding = variant === "badge" ? size * 0.13 : 0;
  const boxHeight = size;
  const boxWidth = variant === "badge" ? size * ratio + padding * 2 : size * ratio;

  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center transition-transform duration-300 ease-gogo",
        variant === "badge" &&
          "rounded-xl bg-primary shadow-[0_6px_18px_rgb(var(--color-primary)/0.3)] group-hover/logo:scale-105",
        className,
      )}
      style={{ width: boxWidth, height: boxHeight, padding }}
    >
      <Image
        src="/logo/gogo-logo.svg"
        alt="GOGO FOOD"
        width={312}
        height={362}
        priority={priority}
        className="h-full w-auto object-contain"
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="GOGO FOOD — Inicio" className="group/logo inline-flex rounded-xl">
      {content}
    </Link>
  );
}

/**
 * Logotipo en línea, dentro de un texto corrido.
 *
 * El logotipo es blanco y celeste, así que sobre fondos claros necesita una
 * placa detrás para verse. Nunca se recolorea ni se deforma el archivo.
 *
 * Se dimensiona en `em`, de modo que crece y encoge con el texto que lo rodea.
 */
export function InlineLogo({
  variant = "badge",
  className,
}: {
  /**
   * `badge` : placa naranja. Para fondos claros neutros.
   * `dark`  : placa oscura. Para fondos NARANJAS, donde una placa naranja no
   *           se distinguiría y el texto que la rodea ya es oscuro.
   * `plain` : sin placa. Solo para fondos oscuros, donde el logotipo se lee solo.
   */
  variant?: "badge" | "dark" | "plain";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative top-[0.08em] mx-[0.1em] inline-flex h-[1.5em] items-center justify-center align-middle",
        variant === "badge" &&
          "rounded-md bg-primary px-[0.28em] shadow-[0_2px_6px_rgb(var(--color-primary)/0.35)]",
        variant === "dark" &&
          "rounded-md bg-onBrand px-[0.28em] shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <Image
        src={INLINE_LOGO_SRC}
        alt="GOGO"
        width={312}
        height={362}
        className="h-[1.15em] w-auto object-contain"
      />
    </span>
  );
}
