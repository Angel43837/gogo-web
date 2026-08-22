import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = {
  title: "Políticas para repartidores",
  description:
    "Políticas de uso, política de entregas y reglas de seguridad para los repartidores de GOGO.",
  alternates: { canonical: "/legal/politicas-repartidores" },
};

export default function PoliticasRepartidoresPage() {
  return (
    <>
      <PageHero
        breadcrumb="Políticas para repartidores"
        eyebrow="Legal"
        title="Políticas para repartidores"
        description="Documento legal pendiente de redacción y validación."
      />
      <ComingSoon
        title="Documento en preparación"
        description="Aquí se publicarán las políticas de uso de la plataforma, la política de entregas y las reglas de seguridad y comportamiento. No mostramos un texto provisional para evitar comunicar condiciones que aún no son oficiales."
      />
    </>
  );
}
