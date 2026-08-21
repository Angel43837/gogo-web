"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Contenido a la derecha del campo (botones, spinners...). */
  suffix?: ReactNode;
};

const inputBase =
  "w-full rounded-xl border bg-white text-[0.95rem] text-foreground transition-colors duration-200 " +
  "placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/35 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/** Campo de texto del sistema de diseño GOGO. */
export const Field = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(function Field({ label, icon: Icon, error, hint, required, suffix, className, ...props }, ref) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        )}
        <input
          id={id}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            inputBase,
            "h-12 px-3.5 py-2",
            Icon && "pl-10",
            suffix && "pr-12",
            error ? "border-red-500 focus:ring-red-500/30" : "border-border hover:border-primary/40",
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </div>

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
});

/** Área de texto con el mismo tratamiento visual que `Field`. */
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & InputHTMLAttributes<HTMLTextAreaElement>
>(function TextareaField({ label, error, hint, required, className, ...props }, ref) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={3}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          inputBase,
          "resize-y px-3.5 py-3",
          error ? "border-red-500 focus:ring-red-500/30" : "border-border hover:border-primary/40",
          className,
        )}
        {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
});

/** Campo de contraseña con botón para mostrar u ocultar. */
export const PasswordField = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-primary"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      }
    />
  );
});

/** Casilla de verificación con etiqueta rica y mensaje de error. */
export const Checkbox = forwardRef<
  HTMLInputElement,
  { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ label, error, className, ...props }, ref) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-2 accent-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            error ? "border-red-500" : "border-border",
            className,
          )}
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-foreground">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
});
