"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lock, Mail, Phone, ShieldCheck, User, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, PasswordField } from "@/components/forms/Field";
import { passwordStrength, step1Schema, type Step1 } from "@/lib/restaurantRegistration";
import { cn } from "@/lib/utils";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";

/** Paso 1 — datos de la persona responsable y su cuenta de acceso. */
export function StepAccount({
  defaults,
  onNext,
}: {
  defaults: Partial<Step1>;
  onNext: (values: Step1) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: { ownerName: "", ownerPhone: "", email: "", password: "", confirm: "", ...defaults },
  });

  const password = watch("password") ?? "";
  const strength = passwordStrength(password);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={User}
        title="Datos del responsable"
        description="La persona que administrará el restaurante en GOGO. Con estos datos se crea la cuenta de acceso."
      />

      <div className="flex flex-col gap-4">
        <Field
          label="Nombre completo"
          required
          icon={User}
          placeholder="Nombre y apellidos"
          autoComplete="name"
          error={errors.ownerName?.message}
          {...register("ownerName")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Teléfono"
            required
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="443 000 0000"
            autoComplete="tel"
            error={errors.ownerPhone?.message}
            {...register("ownerPhone")}
          />
          <Field
            label="Correo electrónico"
            required
            icon={Mail}
            type="email"
            inputMode="email"
            placeholder="tucorreo@gmail.com"
            autoComplete="email"
            hint="Será tu usuario para entrar."
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <PasswordField
          label="Contraseña"
          required
          icon={Lock}
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Medidor de seguridad en tiempo real */}
        {password.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                className={cn(
                  "h-4 w-4 shrink-0",
                  strength.score === strength.max ? "text-emerald-600" : "text-muted",
                )}
                aria-hidden
              />
              <div className="flex flex-1 gap-1" aria-hidden>
                {Array.from({ length: strength.max }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-pill transition-colors duration-300",
                      i < strength.score
                        ? strength.score === strength.max
                          ? "bg-emerald-500"
                          : "bg-primary"
                        : "bg-border",
                    )}
                  />
                ))}
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {strength.checks.map((check) => (
                <li
                  key={check.id}
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    check.ok ? "text-emerald-700" : "text-muted",
                  )}
                >
                  {check.ok ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : (
                    <X className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  )}
                  {check.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <PasswordField
          label="Confirmar contraseña"
          required
          icon={Lock}
          placeholder="Repite la contraseña"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />
      </div>

      <StepActions nextDisabled={!isValid} />
    </form>
  );
}
