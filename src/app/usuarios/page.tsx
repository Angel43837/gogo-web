import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { UserExperience } from "@/components/sections/UserExperience";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTAButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pide con GOGO",
  description:
    "Descubre restaurantes, arma tu pedido, paga desde la app y sigue tu entrega hasta la puerta.",
  alternates: { canonical: "/usuarios" },
};

export default function UsuariosPage() {
  return (
    <>
      <PageHero
        breadcrumb="Usuarios"
        eyebrow="Usuarios"
        title={
          <>
            Descubre, pide y <span className="text-brand-gradient">recibe.</span>
          </>
        }
        description="Todo lo que se te antoja, en una sola app: explora restaurantes cerca, confirma tu pedido y sigue su estado en tiempo real."
        actions={
          <CTAButton href="/descarga" variant="onBrand" size="lg">
            <Download className="h-5 w-5" aria-hidden />
            Descarga la App
          </CTAButton>
        }
      />
      <UserExperience />
      <ProcessTimeline />
      <FAQAccordion />
    </>
  );
}
