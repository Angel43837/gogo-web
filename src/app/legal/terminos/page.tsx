import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de GOGO.",
  alternates: { canonical: "/legal/terminos" },
};

export default function TerminosPage() {
  return (
    <>
      <PageHero
        breadcrumb="Términos y condiciones"
        eyebrow="Legal"
        title="Términos y condiciones"
        description="Documento legal pendiente de redacción y validación."
      />
      <ComingSoon
        title="Documento en preparación"
        description={
          <>
            Los términos y condiciones de <InlineLogo /> se publicarán en esta página
            una vez redactados y revisados. No mostramos un texto provisional para evitar comunicar
            condiciones que aún no son oficiales.
          </>
        }
      />
    </>
  );
}
