import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { RiderStoreView } from "@/components/rider/RiderStoreView";

export const metadata: Metadata = {
  title: "Tienda de coins — Repartidores",
  description: "Canjea tus coins acumulados como repartidor GOGO Riders por premios reales.",
  alternates: { canonical: "/tienda" },
  robots: { index: false, follow: true },
};

export default function TiendaPage() {
  return (
    <>
      <PageHero
        breadcrumb="Tienda de coins"
        eyebrow="GOGO Riders"
        title="Canjea tus coins"
        description="Los coins que ganas repartiendo se canjean aquí por premios reales."
      />
      <section className="bg-brand-tint">
        <div className="container py-[var(--space-section-sm)] lg:py-[var(--space-section)]">
          <div className="mx-auto max-w-4xl">
            <RiderStoreView />
          </div>
        </div>
      </section>
    </>
  );
}
