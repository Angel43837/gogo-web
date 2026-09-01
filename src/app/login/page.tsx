import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { FormCard } from "@/components/forms/FormShell";
import { RiderLoginForm } from "@/components/forms/RiderLoginForm";

export const metadata: Metadata = {
  title: "Inicia sesión — Repartidores",
  description: "Entra con tu cuenta de repartidor GOGO Riders para ver tu saldo de coins y canjear premios.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        breadcrumb="Iniciar sesión"
        eyebrow="GOGO Riders"
        title="Tu cuenta de repartidor"
        description="Entra con tu correo y contraseña para ver tu saldo de coins y canjearlos por premios."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-xl">
            <FormCard>
              <Suspense fallback={null}>
                <RiderLoginForm />
              </Suspense>
            </FormCard>
          </div>
        </div>
      </section>
    </>
  );
}
