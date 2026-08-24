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
/**
 * Versiones horizontales del logotipo, para usarlo DENTRO de un texto.
 * Se eligen según la palabra que sustituyen, para que el renglón siga
 * leyéndose igual: "GOGO" -> wordmark, "GOGO FOOD" -> wordmark con FOOD.
 */
const INLINE_WORDMARKS = {
  gogo: { src: "/logo/gogo-wordmark.png", width: 2210, height: 569, alt: "GOGO" },
  food: { src: "/logo/gogo-wordmark-food.png", width: 2210, height: 888, alt: "GOGO FOOD" },
} as const;

/**
 * Los tres lockups oficiales disponibles.
 * `food` es el horizontal completo: el que mejor funciona en barras de
 * navegación y pies de página, donde el apilado queda pequeño e ilegible.
 */
const LOCKUPS = {
  stacked: { src: "/logo/gogo-logo.svg", width: 312, height: 362, alt: "GOGO FOOD" },
  horizontal: { src: "/logo/gogo-wordmark.png", width: 2210, height: 569, alt: "GOGO" },
  food: { src: "/logo/gogo-wordmark-food.png", width: 2210, height: 888, alt: "GOGO FOOD" },
} as const;

type LogoProps = {
  /**
   * `badge`: el logotipo oficial sobre la placa naranja de marca (para fondos claros).
   * `light`: el logotipo tal cual, para fondos oscuros o naranjas.
   */
  variant?: "badge" | "light";
  /** Qué versión del logotipo usar. */
  lockup?: keyof typeof LOCKUPS;
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
export function Logo({
  variant = "badge",
  lockup = "food",
  className,
  size = 44,
  href = "/",
  priority,
}: LogoProps) {
  const mark = LOCKUPS[lockup];
  const ratio = mark.width / mark.height;
  const padding = variant === "badge" ? size * 0.13 : 0;
  const boxHeight = size;
  const boxWidth = size * ratio + padding * 2;

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
        src={mark.src}
        alt={mark.alt}
        width={mark.width}
        height={mark.height}
        priority={priority}
        sizes="320px"
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
  word = "gogo",
  variant = "badge",
  className,
}: {
  /** Qué palabra sustituye: "GOGO" o "GOGO FOOD". */
  word?: keyof typeof INLINE_WORDMARKS;
  /**
   * `badge` : placa naranja. Para fondos claros neutros.
   * `dark`  : placa oscura. Para fondos NARANJAS, donde una placa naranja no
   *           se distinguiría y el texto que la rodea ya es oscuro.
   * `plain` : sin placa. Solo para fondos oscuros, donde el logotipo se lee solo.
   */
  variant?: "badge" | "dark" | "plain";
  className?: string;
}) {
  const mark = INLINE_WORDMARKS[word];
  const withPlate = variant !== "plain";

  return (
    <span
      className={cn(
        "relative top-[0.06em] mx-[0.12em] inline-flex items-center justify-center align-middle",
        // El lockup con FOOD es más alto, así que necesita algo más de caja.
        word === "food" ? "h-[1.9em]" : "h-[1.35em]",
        variant === "badge" &&
          "rounded-md bg-primary px-[0.3em] shadow-[0_2px_6px_rgb(var(--color-primary)/0.35)]",
        variant === "dark" &&
          "rounded-md bg-onBrand px-[0.3em] shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <Image
        src={mark.src}
        alt={mark.alt}
        width={mark.width}
        height={mark.height}
        // Se sirve pequeño: nunca se pinta a más de ~120 px de ancho.
        sizes="140px"
        className={cn(
          "w-auto object-contain",
          word === "food" ? "h-[1.45em]" : "h-[0.85em]",
          // Sin placa el logotipo va suelto sobre el fondo oscuro.
          !withPlate && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
        )}
      />
    </span>
  );
}
