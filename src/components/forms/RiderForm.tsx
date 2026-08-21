"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Check, Clock, Info, Loader2, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CTAButton } from "@/components/ui/Button";
import { PendingTag } from "@/components/ui/SectionTitle";
import { Checkbox, Field, PasswordField } from "@/components/forms/Field";
import { FormCard, FormError, FormSection, FormSuccess } from "@/components/forms/FormShell";
import { SuccessPanel } from "@/components/forms/SuccessPanel";
import {
  driverCommitments,
  driverOnboarding,
  driverRequirements,
  riderPerks,
} from "@/data/drivers";
import { mainAppLink, supabase, supabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo"),
  email: z.string().trim().min(1, "El correo es obligatorio").email("Correo no válido"),
  phone: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Escribe un teléfono de 10 dígitos"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  compromiso: z.literal(true, {
    message: "Debes aceptar el compromiso de seguridad para continuar",
  }),
});

type FormValues = z.infer<typeof schema>;

/**
 * Alta de repartidores — portado de `registro_rider_screen.dart`.
 * Crea la cuenta en el Supabase de PRODUCCIÓN con el rol `repartidor_plus`.
 *
 * Además del alta, la página informa de lo que necesita el aspirante y del
 * compromiso de seguridad que acepta. Ese compromiso se guarda en los
 * metadatos de la cuenta para que quede constancia de cuándo se aceptó.
 */
export function RiderForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [recovering, setRecovering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    if (!supabase) {
      setSubmitError(
        "El registro no está configurado en este entorno. Falta la conexión con Supabase.",
      );
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            phone: values.phone,
            role: "repartidor_plus",
            // Constancia de que aceptó el compromiso, y cuándo.
            safety_ack_at: new Date().toISOString(),
          },
        },
      });

      if (error) throw error;
      setRegistered(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(
        message.includes("already")
          ? "Ese correo ya está registrado."
          : `No se pudo completar el registro: ${message}`,
      );
    }
  };

  if (registered) {
    return (
      <div className="flex flex-col gap-6">
        <SuccessPanel
          icon={Bike}
          title="¡Cuenta creada!"
          description="Ya puedes iniciar sesión en la app. Antes de tu primera entrega, revisa los pasos que faltan."
          actionLabel="Ir al inicio de sesión"
          actionHref={mainAppLink("/moto")}
        />
        <NextSteps />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Programa GOGO Riders */}
      <FormCard className="!p-5 sm:!p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-black tracking-tight text-foreground">
            El programa GOGO Riders
          </h2>
          <PendingTag>Mecánica y montos por definir</PendingTag>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {riderPerks.map((perk) => (
            <li
              key={perk.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-4 text-center"
            >
              <span className="text-2xl" aria-hidden>
                {perk.emoji}
              </span>
              <span className="text-xs font-black text-foreground">{perk.label}</span>
              <span className="text-[11px] leading-snug text-muted">{perk.detail}</span>
            </li>
          ))}
        </ul>
      </FormCard>

      {/* Qué necesitas */}
      <FormCard className="!p-5 sm:!p-6">
        <h2 className="font-display text-base font-black tracking-tight text-foreground">
          Qué necesitas para repartir
        </h2>
        <ul className="mt-4 space-y-2.5">
          {driverRequirements.map((requirement) => (
            <li key={requirement.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  requirement.pending ? "bg-surface text-muted" : "bg-primary/10 text-primary",
                )}
              >
                {requirement.pending ? (
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  requirement.pending ? "text-muted" : "font-medium text-foreground",
                )}
              >
                {requirement.label}
              </span>
              {requirement.pending && (
                <span className="ml-auto rounded-pill border border-dashed border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Por definir
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-3.5 text-xs leading-relaxed text-muted">
          Los requisitos marcados como &laquo;por definir&raquo; se publicarán aquí cuando estén
          confirmados. GOGO no promete ingresos, horarios ni condiciones que todavía no existen.
        </p>
      </FormCard>

      {/* Formulario */}
      <FormCard>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
          {!supabaseConfigured && (
            <FormError>
              Falta configurar la conexión con Supabase en este entorno. El formulario se muestra,
              pero no puede enviar registros.
            </FormError>
          )}

          <FormSection
            icon={Bike}
            title="Tus datos"
            description="Con esta cuenta entrarás a la app para recibir entregas."
          >
            <Field
              label="Nombre completo"
              required
              icon={User}
              placeholder="Tu nombre y apellidos"
              autoComplete="name"
              hint="Tal como aparece en tu identificación oficial."
              error={errors.name?.message}
              {...register("name")}
            />

            <Field
              label="Correo electrónico"
              required
              icon={Mail}
              type="email"
              inputMode="email"
              placeholder="tucorreo@gmail.com"
              autoComplete="email"
              hint="Aquí llegarán los avisos sobre tu solicitud."
              error={errors.email?.message}
              {...register("email")}
            />

            <Field
              label="Teléfono"
              required
              icon={Phone}
              type="tel"
              inputMode="tel"
              placeholder="443 000 0000"
              autoComplete="tel"
              hint="A este número te contactará el restaurante o el cliente si hace falta."
              error={errors.phone?.message}
              {...register("phone")}
            />

            <PasswordField
              label="Contraseña"
              required
              icon={Lock}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              hint="Úsala para entrar a la app de repartidor."
              error={errors.password?.message}
              {...register("password")}
            />
          </FormSection>

          {/* Compromiso de seguridad */}
          <SafetyCommitment error={errors.compromiso?.message} register={register} />

          {submitError && <FormError>{submitError}</FormError>}

          <div className="flex flex-col gap-4">
            <CTAButton type="submit" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Creando cuenta…
                </>
              ) : (
                <>
                  <Bike className="h-5 w-5" aria-hidden />
                  Crear mi cuenta
                </>
              )}
            </CTAButton>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setRecovering(true)}
                className="rounded-pill text-sm font-semibold text-muted underline underline-offset-4 transition-colors hover:text-primary"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <LoginLink href={mainAppLink("/moto")} />
            </div>
          </div>
        </form>

        {recovering && <RecoverPassword onClose={() => setRecovering(false)} />}
      </FormCard>

      {/* Qué pasa después */}
      <NextSteps />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Bloque del compromiso de seguridad, con la casilla obligatoria. */
function SafetyCommitment({
  error,
  register,
}: {
  error?: string;
  register: ReturnType<typeof useForm<FormValues>>["register"];
}) {
  return (
    <div className="rounded-3xl border border-primary/25 bg-primary/[0.04] p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden />
        </span>
        <h3 className="font-display text-lg font-black tracking-tight text-foreground">
          Compromiso de seguridad
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted">
        Repartir en moto es un trabajo de riesgo. Esto es lo que se espera de ti en cada entrega.
      </p>

      <ul className="mt-5 space-y-3.5">
        {driverCommitments.map((commitment) => (
          <li key={commitment.id} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-soft">
              <commitment.icon className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-foreground">{commitment.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                {commitment.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-primary/20 pt-5">
        <Checkbox
          label={
            <>
              Me comprometo a cumplir estas condiciones en <strong>cada</strong> entrega que realice
              con GOGO.
            </>
          }
          error={error}
          {...register("compromiso")}
        />
      </div>
    </div>
  );
}

/** Los pasos que siguen después de crear la cuenta. */
function NextSteps() {
  return (
    <FormCard className="!p-5 sm:!p-6">
      <h2 className="font-display text-base font-black tracking-tight text-foreground">
        ¿Qué pasa después de registrarte?
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        Crear la cuenta es el primer paso. Aún falta la validación antes de tu primera entrega.
      </p>

      <ol className="mt-5 space-y-3">
        {driverOnboarding.map((step) => (
          <li key={step.step} className="flex gap-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
              {step.step}
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-foreground">{step.title}</span>
                {step.pending && <PendingTag>Requisitos por definir</PendingTag>}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                {step.description}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-surface p-3.5 text-xs leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <span>
          Te avisaremos por correo cuando tu solicitud haya sido revisada. El tiempo de validación
          todavía no está definido.
        </span>
      </p>
    </FormCard>
  );
}

/** Envío del enlace de recuperación de contraseña. */
function RecoverPassword({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const enviar = async () => {
    if (!email.trim() || !supabase) return;
    setSending(true);
    try {
      await supabase.auth.resetPasswordForEmail(email.trim());
    } catch {
      /* Se confirma igualmente: no revelamos si el correo existe o no. */
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      {sent ? (
        <div className="flex flex-col gap-4">
          <FormSuccess>
            Si ese correo tiene una cuenta, te enviamos un enlace para crear una contraseña nueva.
            Revisa tu bandeja.
          </FormSuccess>
          <CTAButton variant="outline" onClick={onClose}>
            Cerrar
          </CTAButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-black tracking-tight text-foreground">
              Recuperar contraseña
            </h3>
            <p className="mt-1 text-sm text-muted">
              Escribe tu correo y te enviamos un enlace para crear una nueva.
            </p>
          </div>

          <Field
            label="Correo electrónico"
            icon={Mail}
            type="email"
            inputMode="email"
            placeholder="tucorreo@gmail.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <CTAButton onClick={enviar} disabled={sending || !email.trim()}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                "Enviar enlace"
              )}
            </CTAButton>
            <CTAButton variant="ghost" onClick={onClose}>
              Cancelar
            </CTAButton>
          </div>
        </div>
      )}
    </div>
  );
}

/** Enlace a la app principal. Si aún no hay URL configurada, no se inventa. */
function LoginLink({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <p className="text-center text-sm text-muted">
      ¿Ya tienes cuenta?{" "}
      <a
        href={href}
        className="font-bold text-primary underline underline-offset-4 transition-colors hover:text-primary-dark"
      >
        Inicia sesión
      </a>
    </p>
  );
}
