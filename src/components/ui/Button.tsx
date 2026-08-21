import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "onDark" | "onBrand" | "onBrandGhost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-semibold rounded-pill " +
  "transition-all duration-300 ease-gogo select-none whitespace-nowrap " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-fg shadow-[0_8px_24px_rgb(var(--color-primary)/0.28)] " +
    "hover:bg-primary-dark hover:shadow-glow hover:-translate-y-0.5",
  secondary:
    "bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5 shadow-card",
  outline:
    "border border-border bg-background text-foreground hover:border-primary/60 hover:text-primary hover:-translate-y-0.5",
  ghost: "text-foreground hover:bg-surface hover:text-primary",
  onDark:
    "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/45 hover:-translate-y-0.5",
  // CTA sólido sobre naranja: blanco con texto de marca.
  onBrand:
    "bg-white text-primary-dark shadow-lift hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_44px_rgb(0_0_0/0.28)]",
  // CTA secundario sobre naranja: contorno blanco.
  onBrandGhost:
    "border-2 border-onBrand/35 text-onBrand hover:border-onBrand hover:bg-black/8 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export type CTAButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

/** Botón/CTA reutilizable. Renderiza <Link> si recibe `href`, si no un <button>. */
export function CTAButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  fullWidth,
  ...props
}: CTAButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  if (href && !props.disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
