"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { processSteps } from "@/data/process";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

const actorTone: Record<string, string> = {
  Usuario: "bg-primary/10 text-primary",
  Restaurante: "bg-accent/30 text-foreground",
  Repartidor: "bg-ink/8 text-foreground",
};

/**
 * "Cómo funciona GOGO".
 * Timeline horizontal en desktop y vertical en móvil,
 * con una línea de progreso que avanza con el scroll.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="como-funciona" className="relative overflow-hidden bg-brand-tint">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Cómo funciona"
          title={
            <>
              De la app a tu puerta,{" "}
              <span className="text-brand-gradient">en cinco pasos</span>
            </>
          }
          description="Así se mueve un pedido dentro de GOGO, desde que alguien decide qué quiere hasta que lo recibe."
          className="mx-auto max-w-3xl"
        />

        <div ref={ref} className="relative mt-16">
          {/* Riel — desktop */}
          <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-0.5 bg-border lg:block">
            <motion.div
              className="h-full origin-left bg-primary"
              style={reduceMotion ? { scaleX: 1 } : { scaleX }}
            />
          </div>
          {/* Riel — móvil */}
          <div className="pointer-events-none absolute bottom-6 left-7 top-6 w-0.5 bg-border lg:hidden">
            <motion.div
              className="h-full w-full origin-top bg-primary"
              style={reduceMotion ? { scaleY: 1 } : { scaleY: scaleX }}
            />
          </div>

          <ol className="relative flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-5">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                {/* Nodo */}
                <div className="relative z-10 shrink-0 lg:mb-5">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-flame-tint
                               bg-primary text-primary-fg shadow-[0_10px_24px_rgb(var(--color-primary)/0.28)]"
                  >
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full
                               border-2 border-flame-tint bg-ink text-[10px] font-black text-white"
                  >
                    {step.step}
                  </span>
                </div>

                <div className="pb-1 lg:pr-4">
                  <span
                    className={cn(
                      "inline-flex rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      actorTone[step.actor],
                    )}
                  >
                    {step.actor}
                  </span>
                  <h3 className="mt-2.5 font-display text-lg font-black leading-tight tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
