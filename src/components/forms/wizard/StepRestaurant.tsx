"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin, Phone, Store, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, SelectField } from "@/components/forms/Field";
import { ChipGroup } from "@/components/forms/FormShell";
import { LocationPicker } from "@/components/forms/wizard/LocationPicker";
import { StepActions, StepHeader } from "@/components/forms/wizard/StepShell";
import { mexicanStates } from "@/data/restaurantRegistration";
import { restaurantCategories } from "@/data/restaurantCategories";
import { step2Schema, type Step2 } from "@/lib/restaurantRegistration";

/** Paso 2 — identidad y ubicación del establecimiento. */
export function StepRestaurant({
  defaults,
  onNext,
  onBack,
}: {
  defaults: Partial<Step2>;
  onNext: (values: Step2) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      restaurantName: "",
      brandName: "",
      categories: [],
      restaurantPhone: "",
      address: "",
      city: "",
      postalCode: "",
      lat: null,
      lng: null,
      ...defaults,
    },
  });

  const categories = watch("categories") ?? [];
  const address = watch("address") ?? "";
  const lat = watch("lat");
  const lng = watch("lng");
  const coords = typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;

  const toggleCategory = (value: string) =>
    setValue(
      "categories",
      categories.includes(value) ? categories.filter((c) => c !== value) : [...categories, value],
      { shouldValidate: true },
    );

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="flex flex-col gap-7">
      <StepHeader
        icon={Store}
        title="Datos del restaurante"
        description="Así aparecerá tu negocio ante los clientes. La ubicación define tu zona de servicio."
      />

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre comercial"
            required
            icon={Store}
            placeholder="Ej. Tacos El Güero"
            error={errors.restaurantName?.message}
            {...register("restaurantName")}
          />
          <Field
            label="Nombre de la marca"
            icon={Tag}
            placeholder="Solo si es distinto"
            hint="Déjalo vacío si es el mismo."
            error={errors.brandName?.message}
            {...register("brandName")}
          />
        </div>

        <ChipGroup
          label="Categoría o tipo de comida"
          description="Elige una o más: así te encuentran los clientes que buscan por categoría."
          options={restaurantCategories}
          selected={categories}
          onToggle={toggleCategory}
          error={errors.categories?.message}
        />

        <Field
          label="Teléfono del restaurante"
          required
          icon={Phone}
          type="tel"
          inputMode="tel"
          placeholder="443 000 0000"
          hint="Puede ser distinto al del responsable."
          error={errors.restaurantPhone?.message}
          {...register("restaurantPhone")}
        />

        <Field
          label="Dirección del establecimiento"
          required
          icon={MapPin}
          placeholder="Calle, número y colonia"
          autoComplete="street-address"
          error={errors.address?.message}
          {...register("address")}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Ciudad"
            required
            icon={Building2}
            placeholder="Maravatío"
            error={errors.city?.message}
            {...register("city")}
          />
          <SelectField
            label="Estado"
            required
            placeholder="Elige el estado"
            options={mexicanStates}
            error={errors.state?.message}
            {...register("state")}
          />
          <Field
            label="Código postal"
            required
            inputMode="numeric"
            maxLength={5}
            placeholder="61250"
            autoComplete="postal-code"
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-foreground">Ubicación en el mapa</span>
          <LocationPicker
            value={coords}
            address={`${address}, ${watch("city") ?? ""}`}
            onChange={(next, addressFromMap) => {
              setValue("lat", next.lat, { shouldValidate: true });
              setValue("lng", next.lng, { shouldValidate: true });
              if (addressFromMap && !address.trim()) {
                setValue("address", addressFromMap, { shouldValidate: true });
              }
            }}
          />
        </div>
      </div>

      <StepActions onBack={onBack} nextDisabled={!isValid} />
    </form>
  );
}
