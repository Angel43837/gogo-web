import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { PendingTag } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto de GOGO. Se publicarán en cuanto estén habilitados.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contacto"
        eyebrow="Contacto"
        title={
          <>
            Hablemos <span className="text-brand-gradient">pronto.</span>
          </>
        }
        description={
          <>
            Estamos habilitando los canales oficiales de atención de <InlineLogo variant="dark" />.
          </>
        }
      />
      <ComingSoon
        title="Formulario de contacto en preparación"
        description="Todavía no publicamos correos, teléfonos ni redes sociales porque los canales oficiales no están definidos. Este espacio queda listo para el formulario de contacto."
        note={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PendingTag>Correo</PendingTag>
            <PendingTag>Teléfono</PendingTag>
            <PendingTag>Redes sociales</PendingTag>
          </div>
        }
      />
    </>
  );
}
