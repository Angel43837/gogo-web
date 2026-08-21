import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Descarga la app de GOGO",
  description:
    "La aplicación de GOGO estará disponible en las tiendas oficiales. Los enlaces se publicarán aquí.",
  alternates: { canonical: "/descarga" },
};

export default function DescargaPage() {
  return (
    <>
      <PageHero
        breadcrumb="Descarga"
        eyebrow="Descarga"
        title={
          <>
            Todo empieza <span className="text-brand-gradient">con GOGO.</span>
          </>
        }
        description="Estamos preparando la publicación de la app. Cuando los enlaces oficiales existan, aparecerán en esta página."
      />
      <DownloadSection />
      <FinalCTA />
    </>
  );
}
