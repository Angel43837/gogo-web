import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { BonusSection } from "@/components/sections/BonusSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Bonos y promociones",
  description:
    "Aquí se publicarán los bonos y promociones de GOGO para usuarios, restaurantes y repartidores cuando estén confirmados.",
  alternates: { canonical: "/bonos" },
};

export default function BonosPage() {
  return (
    <>
      <PageHero
        breadcrumb="Bonos"
        eyebrow="Bonos y promociones"
        title={
          <>
            Beneficios <span className="text-brand-gradient">en camino.</span>
          </>
        }
        description="Todavía no hay promociones activas. Esta página es el espacio donde aparecerán en cuanto sean oficiales."
      />
      <BonusSection />
      <FinalCTA />
    </>
  );
}
