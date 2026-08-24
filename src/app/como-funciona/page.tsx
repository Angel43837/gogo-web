import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { WhatIsGogo } from "@/components/sections/WhatIsGogo";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Cómo funciona GOGO",
  description:
    "Del pedido a la entrega: así se mueve un pedido dentro de GOGO entre usuarios, restaurantes y repartidores.",
  alternates: { canonical: "/como-funciona" },
};

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        breadcrumb="Cómo funciona"
        eyebrow="Cómo funciona"
        title={
          <>
            Del antojo a la puerta, <span className="text-brand-gradient">paso a paso.</span>
          </>
        }
        description={
          <>
            <InlineLogo variant="dark" /> coordina a tres protagonistas en cada pedido. Aquí puedes
            ver cómo encaja cada uno.
          </>
        }
      />
      <ProcessTimeline />
      <WhatIsGogo />
      <FinalCTA />
    </>
  );
}
