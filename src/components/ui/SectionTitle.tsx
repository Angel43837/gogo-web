import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/Reveal";

type SectionTitleProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark" | "brand";
  className?: string;
  as?: "h2" | "h3";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  as: Heading = "h2",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Heading
          className={cn(
            "font-display text-[2rem] font-black leading-[1.08] tracking-tight text-balance sm:text-4xl lg:text-5xl",
            tone === "light" ? "text-foreground" : "text-white",
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-pretty sm:text-lg",
              tone === "light" && "text-muted",
              tone === "dark" && "text-white/70",
              // Sobre naranja medio el texto va en blanco puro para cumplir AA.
              // Blanco sobre #f7500c solo llega a 3.44:1: el cuerpo va oscuro.
              tone === "brand" && "text-onBrand font-medium",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Etiqueta pequeña sobre el título de sección. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "brand";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
        tone === "light" && "border border-primary/20 bg-primary/8 text-primary",
        tone === "dark" && "border border-white/15 bg-white/10 text-white/85",
        // Chip sólido: el blanco a 12px sobre naranja no contrastaría.
        tone === "brand" && "bg-white text-primary-dark",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "dark" ? "bg-white" : "bg-primary",
        )}
      />
      {children}
    </span>
  );
}

/** Marca visualmente el contenido que el equipo de GOGO todavía no ha definido. */
export function PendingTag({ children = "Por definir" }: { children?: ReactNode }) {
  return (
    <span className="tag-pending">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
      {children}
    </span>
  );
}
