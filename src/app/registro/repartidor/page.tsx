import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { DriverWizard } from "@/components/forms/DriverWizard";

export const metadata: Metadata = {
  title: "Regístrate como repartidor",
  description:
    "Crea tu cuenta de repartidor en GOGO en cinco pasos: datos, ubicación, medio de transporte, foto y confirmación.",
  alternates: { canonical: "/registro/repartidor" },
  robots: { index: false, follow: true },
};

export default function RegistroRepartidorPage() {
  return (
    <>
      <PageHero
        breadcrumb="Registro de repartidor"
        eyebrow="GOGO Riders"
        title={
          <>
            Únete a{" "}
            <span className="text-brand-gradient">
              <InlineLogo variant="dark" /> Riders.
            </span>
          </>
        }
        description="Cinco pasos cortos. No pedimos licencia ni papeles del vehículo: el perfil completo se termina después, desde la app para repartidores."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-3xl">
            <DriverWizard />
          </div>
        </div>
      </section>
    </>
  );
}
