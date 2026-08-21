import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
