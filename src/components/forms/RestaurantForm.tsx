"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Crosshair,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CTAButton } from "@/components/ui/Button";
import { Field, PasswordField, TextareaField } from "@/components/forms/Field";
import { ChipGroup, FormCard, FormError, FormSection } from "@/components/forms/FormShell";
import { SuccessPanel } from "@/components/forms/SuccessPanel";
import { restaurantCategories } from "@/data/restaurantCategories";
import { mainAppLink, supabase, supabaseConfigured } from "@/lib/supabase";
import {
  detectZona,
  direccionDesdeCoords,
  posicionActual,
  zonaFromCoords,
  type Coords,
} from "@/lib/zona";

const schema = z
  .object({
    restName: z.string().trim().min(1, "El nombre del restaurante es obligatorio"),
    description: z.string().trim().optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    ownerName: z.string().trim().min(1, "Tu nombre es obligatorio"),
    email: z.string().trim().min(1, "El correo es obligatorio").email("Correo no válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirm: z.string().min(1, "Repite la contraseña"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

/**
 * Alta de restaurantes — portado de `registro_restaurante_screen.dart`.
 *
 * Escribe en el proyecto de PRODUCCIÓN de Supabase: crea la cuenta del dueño
 * (rol `dueno`) y la fila del restaurante. La zona se detecta sola, por GPS
 * si se usó el botón de ubicación, o geocodificando la dirección escrita.
 */
export function RestaurantForm() {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const toggleCategoria = (value: string) =>
    setCategorias((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );

  const usarMiUbicacion = async () => {
    setLocating(true);
    setSubmitError(null);
    try {
      const posicion = await posicionActual();
      if (!posicion) {
        setSubmitError("No pudimos obtener tu ubicación. Revisa los permisos del navegador.");
        return;
      }
      setCoords(posicion);
      const direccion = await direccionDesdeCoords(posicion);
      if (direccion) setValue("address", direccion, { shouldValidate: true });
    } finally {
      setLocating(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    if (!supabase) {
      setSubmitError(
        "El registro no está configurado en este entorno. Falta la conexión con Supabase.",
      );
      return;
    }

    try {
      const { data: signUp, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { data: { role: "dueno", name: values.ownerName } },
      });

      if (signUpError) throw signUpError;
      if (!signUp.user) {
        setSubmitError("No se pudo crear la cuenta. Inténtalo de nuevo.");
        return;
      }

      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      // La zona se resuelve sola: por GPS si se usó, o desde la dirección.
      const zona = coords
        ? zonaFromCoords(coords.lat, coords.lng)
        : await detectZona(values.address ?? "");

      const { data: restaurant, error: insertError } = await supabase
        .from("restaurants")
        .insert({
          name: values.restName,
          description: values.description || null,
          address: values.address || null,
          is_open: true,
          rating: 0.0,
          owner_id: signUp.user.id,
          zona,
          categorias,
          ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // El id se guarda en la cuenta, no en caché local: el dueño entrará
      // desde otro dominio (la app principal), así que solo sirve del lado
      // del servidor.
      try {
        await supabase.auth.updateUser({ data: { restaurant_id: restaurant.id } });
      } catch {
        /* No es crítico para completar el alta. */
      }

      setRegistered(values.restName);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(
        message.includes("already registered") || message.includes("already")
          ? "Este correo ya está registrado."
          : `No se pudo completar el registro: ${message}`,
      );
    }
  };

  if (registered) {
    return (
      <SuccessPanel
        icon={Store}
        title="¡Restaurante registrado!"
        highlight={registered}
        description="Entra a la app con tu correo para gestionar tu menú y ver tus pedidos."
        actionLabel="Gestionar mi restaurante"
        actionHref={mainAppLink("/dueno")}
      />
    );
  }

  return (
    <FormCard>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-9">
        {!supabaseConfigured && (
          <FormError>
            Falta configurar la conexión con Supabase en este entorno. El formulario se muestra,
            pero no puede enviar registros.
          </FormError>
        )}

        <FormSection
          icon={UtensilsCrossed}
          title="Información del restaurante"
          description="Así te van a ver los clientes dentro de la app."
        >
          <Field
            label="Nombre del restaurante"
            required
            icon={Store}
            placeholder="Ej. Tacos El Güero"
            autoComplete="organization"
            error={errors.restName?.message}
            {...register("restName")}
          />

          <TextareaField
            label="Descripción"
            placeholder="¿Qué tipo de comida vendes?"
            error={errors.description?.message}
            {...register("description")}
          />

          <Field
            label="Dirección"
            icon={MapPin}
            placeholder="Ej. Calle Morelos 45, Col. Centro, Maravatío"
            autoComplete="street-address"
            hint={
              coords
                ? "Ubicación detectada: la zona se asignará con esas coordenadas."
                : "Puedes escribirla o detectarla con el botón."
            }
            error={errors.address?.message}
            suffix={
              <button
                type="button"
                onClick={usarMiUbicacion}
                disabled={locating}
                aria-label="Detectar mi ubicación"
                title="Detectar mi ubicación"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-primary disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Crosshair className="h-4 w-4" aria-hidden />
                )}
              </button>
            }
            {...register("address")}
          />

          <Field
            label="Teléfono"
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="443 000 0000"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <ChipGroup
            label="Categoría de tu restaurante"
            description="Elige una o más: así te encuentran los clientes que buscan por categoría."
            options={restaurantCategories}
            selected={categorias}
            onToggle={toggleCategoria}
          />
        </FormSection>

        <FormSection
          icon={Lock}
          title="Tu cuenta de acceso"
          description="Con esto entrarás a gestionar tu restaurante."
        >
          <Field
            label="Tu nombre"
            required
            icon={User}
            placeholder="Nombre del dueño"
            autoComplete="name"
            error={errors.ownerName?.message}
            {...register("ownerName")}
          />

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
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordField
            label="Confirmar contraseña"
            required
            icon={Lock}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
        </FormSection>

        {submitError && <FormError>{submitError}</FormError>}

        <div className="flex flex-col gap-4">
          <CTAButton type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Registrando…
              </>
            ) : (
              <>
                <Store className="h-5 w-5" aria-hidden />
                Registrar restaurante
              </>
            )}
          </CTAButton>

          <LoginLink href={mainAppLink("/dueno-login")} />
        </div>
      </form>
    </FormCard>
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
