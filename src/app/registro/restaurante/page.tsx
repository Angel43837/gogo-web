import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { RestaurantForm } from "@/components/forms/RestaurantForm";

export const metadata: Metadata = {
  title: "Registra tu restaurante",
  description:
    "Da de alta tu restaurante en GOGO: publica tu carta, recibe pedidos y apóyate en la red de repartidores.",
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
        description="Completa el formulario y tu restaurante quedará listo para recibir pedidos en GOGO."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-2xl">
            <RestaurantForm />
          </div>
        </div>
      </section>
    </>
  );
}
