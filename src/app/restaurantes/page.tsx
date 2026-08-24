import type { Metadata } from "next";
import { Store } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CTAButton } from "@/components/ui/Button";
import { futureRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Registra tu restaurante en GOGO",
  description:
    "Publica tu carta, recibe pedidos desde la plataforma y apóyate en la red de repartidores GOGO.",
  alternates: { canonical: "/restaurantes" },
};

export default function RestaurantesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Restaurantes"
        eyebrow="Restaurantes"
        title={
          <>
            Tu restaurante merece <span className="text-brand-gradient">llegar más lejos.</span>
          </>
        }
        description={
          <>
            Suma tu restaurante a <InlineLogo variant="dark" /> y conecta con personas que todavía
            no te conocen.
          </>
        }
        actions={
          <CTAButton href={futureRoutes.registroRestaurante} variant="onBrand" size="lg">
            <Store className="h-5 w-5" aria-hidden />
            Registra tu restaurante
          </CTAButton>
        }
      />
      <BusinessSection />
      <ProcessTimeline />
      <FinalCTA />
    </>
  );
}
