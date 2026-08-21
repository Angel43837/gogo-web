import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-brand-tint pt-24">
      <div aria-hidden className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div className="container relative text-center">
        <p className="font-display text-[5rem] font-black leading-none text-brand-gradient sm:text-[7rem]">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Esta ruta todavía no existe
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          Puede que la página esté en construcción o que el enlace haya cambiado.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CTAButton href="/" size="lg">
            Volver al inicio
          </CTAButton>
          <CTAButton href="/faq" variant="outline" size="lg">
            Ver preguntas frecuentes
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
