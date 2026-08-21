import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { RestaurantWizard } from "@/components/forms/RestaurantWizard";

export const metadata: Metadata = {
  title: "Registra tu restaurante",
  description:
    "Da de alta tu restaurante en GOGO en cinco pasos: cuenta, datos del negocio, ubicación, imágenes y confirmación.",
  alternates: { canonical: "/registro/restaurante" },
  robots: { index: false, follow: true },
};

export default function RegistroRestaurantePage() {
  return (
    <>
      <PageHero
        breadcrumb="Registro de restaurante"
        eyebrow="Registro"
        title={
          <>
            Registra tu <span className="text-brand-gradient">restaurante.</span>
          </>
        }
        description="Cinco pasos cortos. Solo lo indispensable para crear tu cuenta: el menú y los productos se cargan después, desde la app para restaurantes."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-3xl">
            <RestaurantWizard />
          </div>
        </div>
      </section>
    </>
  );
}
