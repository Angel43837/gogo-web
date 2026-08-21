import { Hero } from "@/components/hero/Hero";
import { ScrollVideo } from "@/components/sections/ScrollVideo";
import { WhatIsGogo } from "@/components/sections/WhatIsGogo";
import { Ecosystems } from "@/components/sections/Ecosystems";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { UserExperience } from "@/components/sections/UserExperience";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { DriverSection } from "@/components/sections/DriverSection";
import { BonusSection } from "@/components/sections/BonusSection";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { faqs } from "@/data/faq";

/** Datos estructurados de las preguntas frecuentes. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollVideo />
      <WhatIsGogo />
      <Ecosystems />
      <ProcessTimeline />
      <UserExperience />
      <BusinessSection />
      <DriverSection />
      <BonusSection />
      <DownloadSection />
      <FAQAccordion />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
