import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = {
  title: "Políticas para restaurantes",
  description: "Políticas que rigen la relación entre GOGO y los restaurantes de la plataforma.",
  alternates: { canonical: "/legal/politicas-restaurantes" },
};

export default function PoliticasRestaurantesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Políticas para restaurantes"
        eyebrow="Legal"
        title="Políticas para restaurantes"
        description="Documento legal pendiente de redacción y validación."
      />
      <ComingSoon
        title="Documento en preparación"
        description="Las políticas para restaurantes se publicarán en esta página una vez redactadas y revisadas. No mostramos un texto provisional para evitar comunicar condiciones que aún no son oficiales."
      />
    </>
  );
}
