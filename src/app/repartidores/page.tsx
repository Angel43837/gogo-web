import type { Metadata } from "next";
import { Bike } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { DriverSection } from "@/components/sections/DriverSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CTAButton } from "@/components/ui/Button";
import { futureRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reparte con GOGO",
  description:
    "Regístrate con tu motocicleta, recibe solicitudes de entrega y genera ingresos realizando repartos.",
  alternates: { canonical: "/repartidores" },
};

export default function RepartidoresPage() {
  return (
    <>
      <PageHero
        breadcrumb="Repartidores"
        eyebrow="Repartidores"
        title={
          <>
            Tu moto. Tu tiempo. <span className="text-brand-gradient">Tu oportunidad.</span>
          </>
        }
        description={
          <>
            Súmate como repartidor de <InlineLogo variant="dark" />: recoge pedidos en los
            restaurantes y entrégalos a quienes los esperan.
          </>
        }
        actions={
          <CTAButton href={futureRoutes.registroRepartidor} variant="onBrand" size="lg">
            <Bike className="h-5 w-5" aria-hidden />
            Quiero ser repartidor
          </CTAButton>
        }
      />
      <DriverSection />
      <FAQAccordion />
      <FinalCTA />
    </>
  );
}
