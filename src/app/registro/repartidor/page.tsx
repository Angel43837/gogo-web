import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { RiderForm } from "@/components/forms/RiderForm";

export const metadata: Metadata = {
  title: "Regístrate como repartidor",
  description:
    "Crea tu cuenta de repartidor en GOGO: recibe solicitudes de entrega y genera ingresos con tu moto.",
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
            Únete a <span className="text-brand-gradient">GOGO Riders.</span>
          </>
        }
        description="Crea tu cuenta y empieza a recibir solicitudes de entrega desde la app."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-2xl">
            <RiderForm />
          </div>
        </div>
      </section>
    </>
  );
}
