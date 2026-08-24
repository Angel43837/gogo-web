import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { InlineLogo } from "@/components/ui/Logo";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resuelve tus dudas sobre GOGO: cómo pedir, cómo registrar tu restaurante y cómo repartir.",
  alternates: { canonical: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        breadcrumb="FAQ"
        eyebrow="Preguntas frecuentes"
        title={
          <>
            Todo lo que <span className="text-brand-gradient">quieres saber.</span>
          </>
        }
        description={
          <>
            Respuestas claras sobre <InlineLogo variant="dark" />. Lo que aún no está definido, lo
            señalamos como tal.
          </>
        }
      />
      <FAQAccordion />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
