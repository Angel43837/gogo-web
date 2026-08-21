"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/data/faq";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTAButton } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-brand-tint">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Preguntas frecuentes"
          title={
            <>
              Lo que la gente <span className="text-brand-gradient">suele preguntar</span>
            </>
          }
          description="Si algo todavía no está definido, lo decimos con claridad en lugar de improvisar una respuesta."
          className="mx-auto max-w-3xl"
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <ul className="space-y-3">
            {faqs.map((item, i) => {
              const expanded = open === i;
              return (
                <Reveal key={item.q} as="li" delay={Math.min(i * 0.04, 0.2)}>
                  <div
                    className={cn(
                      "overflow-hidden rounded-2xl border transition-colors duration-300",
                      expanded
                        ? "border-primary/40 bg-white"
                        : "border-primary/15 bg-white/70 hover:border-primary/35 hover:bg-white",
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : i)}
                        aria-expanded={expanded}
                        aria-controls={"faq-panel-" + i}
                        id={"faq-btn-" + i}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                      >
                        <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-gogo",
                            expanded ? "rotate-45 bg-primary text-primary-fg" : "bg-primary/10 text-primary",
                          )}
                          aria-hidden
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          id={"faq-panel-" + i}
                          role="region"
                          aria-labelledby={"faq-btn-" + i}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6 sm:text-base">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.15} className="mt-10 text-center">
            <p className="text-sm text-muted">¿No encontraste lo que buscabas?</p>
            <CTAButton href="/contacto" variant="outline" size="md" className="mt-4">
              Contáctanos
            </CTAButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
