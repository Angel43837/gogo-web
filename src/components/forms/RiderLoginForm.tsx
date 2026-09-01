"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Field, PasswordField } from "@/components/forms/Field";
import { FormError } from "@/components/forms/FormShell";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { signInRider } from "@/lib/riderAuth";

const schema = z.object({
  email: z.string().trim().min(1, "El correo es obligatorio").email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type FormValues = z.infer<typeof schema>;

/** Login del repartidor independiente — entrada a la tienda de coins. */
export function RiderLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await signInRider(values.email, values.password);
      const redirect = searchParams.get("redirect") || "/tienda";
      router.push(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={Lock}
        title="Inicia sesión"
        description="Usa el correo y la contraseña con los que te registraste en GOGO Riders."
      />

      <div className="flex flex-col gap-4">
        <Field
          label="Correo electrónico"
          required
          icon={Mail}
          type="email"
          inputMode="email"
          placeholder="tucorreo@gmail.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          label="Contraseña"
          required
          icon={Lock}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {error && <FormError>{error}</FormError>}

      <StepActions nextLabel="Iniciar sesión" nextDisabled={!isValid} loading={submitting} />

      <p className="text-center text-sm text-muted">
        ¿Aún no tienes cuenta de repartidor?{" "}
        <a href="/registro/repartidor" className="font-bold text-primary hover:underline">
          Regístrate en GOGO Riders
        </a>
      </p>
    </form>
  );
}
