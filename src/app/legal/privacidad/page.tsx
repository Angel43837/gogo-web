import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad de GOGO.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHero
        breadcrumb="Aviso de privacidad"
        eyebrow="Legal"
        title="Aviso de privacidad"
        description="Documento legal pendiente de redacción y validación."
      />
      <ComingSoon
        title="Documento en preparación"
        description={
          <>
            El aviso de privacidad de <InlineLogo /> se publicará en esta página una
            vez redactado y revisado conforme a la normativa aplicable.
          </>
        }
      />
    </>
  );
}
