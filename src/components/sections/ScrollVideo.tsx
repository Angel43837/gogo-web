"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { scrollFrames } from "@/data/scrollFrames";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   AJUSTES DEL PLANO — todo el encuadre se controla desde aquí.

   No hay etiqueta <video>: el plano es una SECUENCIA DE IMÁGENES pintada en
   un <canvas>. Con video, cada salto de scroll obliga al navegador a
   decodificar desde el keyframe anterior y se congela. Con imágenes, cada
   salto es "pinta la imagen N": coste constante, y además carga progresiva —
   en cuanto llega la primera imagen ya se ve algo.

   Los fotogramas los genera `npm run video` (scripts/prepare-video.mjs).
   ========================================================================== */

/** Punto focal del encuadre, 0-1. Baja `y` para subir el plano. */
const FOCUS = { x: 0.5, y: 0.55 };

/** Zoom: arranca acercado a la moto y se abre al avanzar el scroll. */
const ZOOM = { from: 1.24, to: 1.04 };

/** Altura de la banda visible. Cuanto más estrecha, más cinematográfica. */
const BAND = { top: "13%", bottom: "87%" };

/** Recorrido de scroll durante el que la sección queda fijada (pin). */
const SCROLL_DISTANCE = { desktop: "+=280%", mobile: "+=190%" };

/** Suavizado del scrub, en segundos que tarda el plano en alcanzar al scroll. */
const SCRUB = 0.6;

/** Descargas simultáneas. Suficiente para ir rápido sin saturar la conexión. */
const CONCURRENCY = 6;

/** Rótulos: `at` es la posición en el recorrido (0 a 1). */
const phases = [
  { at: 0, title: "El pedido sale del restaurante", caption: "Recién preparado" },
  { at: 0.38, title: "La moto ya está en camino", caption: "En ruta hacia ti" },
  { at: 0.74, title: "Llega a tu puerta", caption: "Pedido entregado" },
];

/** Máscara que funde los bordes del plano con el naranja de la página. */
const bandMask = `linear-gradient(to bottom, transparent 0%, #000 ${BAND.top}, #000 ${BAND.bottom}, transparent 100%)`;

const frameUrl = (dir: string, i: number) =>
  `${dir}/${String(i + 1).padStart(scrollFrames.pad, "0")}.webp`;

/**
 * Plano a sangre completa controlado por el scroll (GSAP ScrollTrigger).
 *
 * Una timeline con `scrub` mueve un objeto proxy con el número de fotograma y
 * el zoom; cada actualización se pinta en el canvas. Los rótulos y la barra de
 * progreso viven en la misma timeline, así que hacer scroll no provoca renders.
 */
export function ScrollVideo() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!canvas || !ctx) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduce } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduce: boolean;
          };

          // En móvil se descarga el juego pequeño: menos de la mitad de peso.
          const variant = isDesktop ? scrollFrames.desktop : scrollFrames.mobile;

          const images: (HTMLImageElement | null)[] = new Array(scrollFrames.count).fill(null);
          const state = { frame: 0, zoom: ZOOM.from };
          let disposed = false;
          let pending = false;

          /* --- Pintado ------------------------------------------------- */

          /** Devuelve el fotograma pedido o, si aún no ha llegado, el más cercano ya cargado. */
          const nearestLoaded = (index: number) => {
            if (images[index]) return images[index];
            for (let d = 1; d < scrollFrames.count; d++) {
              if (images[index - d]) return images[index - d];
              if (images[index + d]) return images[index + d];
            }
            return null;
          };

          const draw = () => {
            pending = false;
            if (disposed) return;

            const index = Math.max(0, Math.min(scrollFrames.count - 1, Math.round(state.frame)));
            const img = nearestLoaded(index);
            if (!img) return;

            const cw = canvas.width;
            const ch = canvas.height;
            // Equivalente a object-fit: cover + object-position, más el zoom.
            const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * state.zoom;
            const dw = img.naturalWidth * scale;
            const dh = img.naturalHeight * scale;
            ctx.drawImage(img, (cw - dw) * FOCUS.x, (ch - dh) * FOCUS.y, dw, dh);
          };

          /** Agrupa los repintados en un rAF: el scroll dispara muchos por frame. */
          const requestDraw = () => {
            if (pending || disposed) return;
            pending = true;
            requestAnimationFrame(draw);
          };

          /* --- Tamaño del canvas --------------------------------------- */

          const resize = () => {
            // Se limita a 2x: por encima el coste de pintado no compensa.
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.round(canvas.clientWidth * dpr);
            const height = Math.round(canvas.clientHeight * dpr);
            if (width === canvas.width && height === canvas.height) return;
            canvas.width = width;
            canvas.height = height;
            draw();
          };

          resize();
          const observer = new ResizeObserver(resize);
          observer.observe(canvas);

          /* --- Carga progresiva ---------------------------------------- */

          let nextToLoad = 0;
          const loadNext = () => {
            if (disposed || nextToLoad >= scrollFrames.count) return;
            const index = nextToLoad++;
            const img = new Image();
            img.decoding = "async";
            img.src = frameUrl(variant.dir, index);
            const done = () => {
              if (disposed) return;
              images[index] = img;
              // El primero se pinta en cuanto llega: la sección nunca queda vacía.
              if (index === 0) draw();
              else requestDraw();
              loadNext();
            };
            img.onload = done;
            img.onerror = () => {
              if (!disposed) loadNext();
            };
          };
          for (let i = 0; i < CONCURRENCY; i++) loadNext();

          /* --- Movimiento reducido: plano fijo, sin secuestrar el scroll -- */

          if (reduce) {
            state.zoom = ZOOM.to;
            gsap.set(".js-caption", { autoAlpha: 0 });
            gsap.set(".js-caption-0", { autoAlpha: 1 });
            gsap.set(".js-progress", { scaleX: 1 });
            return () => {
              disposed = true;
              observer.disconnect();
            };
          }

          /* --- Timeline ------------------------------------------------ */

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: isDesktop ? SCROLL_DISTANCE.desktop : SCROLL_DISTANCE.mobile,
              scrub: SCRUB,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 1. Avance de la secuencia y apertura del plano.
          tl.to(
            state,
            {
              frame: scrollFrames.count - 1,
              zoom: ZOOM.to,
              duration: 1,
              onUpdate: requestDraw,
            },
            0,
          );

          // 2. El titular se despega al empezar a avanzar.
          tl.to(".js-headline", { autoAlpha: 0, y: -30, duration: 0.18, ease: "power2.in" }, 0.08);

          // 3. La pista de scroll desaparece en cuanto se entiende el gesto.
          tl.to(".js-hint", { autoAlpha: 0, duration: 0.06 }, 0.02);

          // 4. Barra de progreso.
          tl.fromTo(".js-progress", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

          // 5. Relevo de rótulos: cada uno entra y sale en su tramo.
          phases.forEach((phase, i) => {
            const el = `.js-caption-${i}`;
            const following = phases[i + 1];
            const fade = 0.05;

            tl.fromTo(
              el,
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: fade, ease: "power2.out" },
              i === 0 ? 0.16 : phase.at,
            );

            if (following) {
              tl.to(el, { autoAlpha: 0, y: -16, duration: fade, ease: "power2.in" }, following.at);
            }
          });

          // La timeline y el ScrollTrigger los revierte GSAP; esto es lo propio.
          return () => {
            disposed = true;
            observer.disconnect();
          };
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="scroll-video-title"
      className="relative h-[100svh] w-full overflow-hidden bg-brand-deep"
    >
      {/*
        Adelanta el primer fotograma: empieza a descargarse mientras se parsea
        el HTML, antes incluso de hidratar. React lo eleva al <head>.
      */}
      <link
        rel="preload"
        as="image"
        href={frameUrl(scrollFrames.desktop.dir, 0)}
        media="(min-width: 1024px)"
      />
      <link
        rel="preload"
        as="image"
        href={frameUrl(scrollFrames.mobile.dir, 0)}
        media="(max-width: 1023px)"
      />

      {/* --- Plano a sangre completa, con los bordes fundidos en el naranja --- */}
      <div className="absolute inset-0" style={{ WebkitMaskImage: bandMask, maskImage: bandMask }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Repartidor de GOGO conduciendo su motocicleta por la ciudad"
          className="absolute inset-0 h-full w-full"
        />

        {/* Viraje naranja: integra la imagen en la paleta de marca */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-primary/30 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-flame-deeper/25 mix-blend-multiply"
        />
      </div>

      {/* --- Fundidos que rematan la unión con las secciones vecinas --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] bg-gradient-to-b from-flame-deep via-flame-deep/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26vh] bg-gradient-to-t from-flame-deeper via-flame-deeper/75 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 75% at 50% 50%, transparent 40%, rgb(var(--color-brand-deep-2) / 0.6) 100%)",
        }}
      />

      {/* --- Contenido sobre el plano --- */}
      <div className="relative flex h-full flex-col justify-between py-[max(4rem,10vh)]">
        <div className="js-headline container text-center">
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/30 bg-black/25 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-soft" />
            En movimiento
          </span>
          <h2
            id="scroll-video-title"
            className="mx-auto mt-5 max-w-3xl font-display text-[2.1rem] font-black leading-[1.04] tracking-tight text-white text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl"
          >
            Cada pedido <span className="text-accent-soft">se mueve contigo.</span>
          </h2>
        </div>

        <div className="container">
          {/* Rótulos: los tres se apilan y la timeline los va relevando */}
          <div className="relative min-h-[4.5rem] max-w-md">
            {phases.map((phase, i) => (
              <div
                key={phase.title}
                className={cn("js-caption js-caption-" + i, "absolute inset-x-0 bottom-0")}
                style={{ visibility: "hidden", opacity: 0 }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-soft">
                  {phase.caption}
                </p>
                <p className="mt-1.5 font-display text-xl font-black leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl">
                  {phase.title}
                </p>
              </div>
            ))}
          </div>

          <p className="js-hint mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
            Desliza para avanzar
          </p>
        </div>
      </div>

      {/* Barra de progreso pegada al borde inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/12">
        <div className="js-progress h-full origin-left scale-x-0 bg-primary" />
      </div>
    </section>
  );
}
