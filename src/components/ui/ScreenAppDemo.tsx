"use client";

import { useEffect, useRef } from "react";
import { Battery, Signal, Wifi } from "lucide-react";

/* ==========================================================================
   Grabación real de la app GOGO Food dentro del teléfono.

   El archivo lo genera `npm run demo` (scripts/prepare-demo.mjs), que recorta
   el cromo del navegador y los segundos iniciales. Aquí solo se reproduce en
   bucle, así que no hace falta nada del tratamiento all-intra que sí necesita
   el plano del scroll: la reproducción es lineal.
   ========================================================================== */

/** Naranja del fondo de la app, para que el video funda con la pantalla. */
const APP_ORANGE = "#F04E0C";

/**
 * Momentos del clip (en segundos) que corresponden a cada etapa del recorrido.
 * Si vuelves a grabar el video, ajusta estos valores.
 */
export const demoChapters = {
  /** Portada con el logotipo y el listado de restaurantes. */
  descubre: 0,
  /** Restaurante abierto y ficha del producto. */
  elige: 7,
  /** Carrito y confirmación del pedido. */
  pide: 16,
} as const;

export function ScreenAppDemo({ seekTo }: { seekTo?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Al cambiar de etapa se salta al momento correspondiente del clip.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || seekTo === undefined) return;

    const jump = () => {
      if (Number.isFinite(video.duration) && seekTo < video.duration) {
        video.currentTime = seekTo;
      }
      void video.play().catch(() => {});
    };

    if (video.readyState >= 1) jump();
    else video.addEventListener("loadedmetadata", jump, { once: true });

    return () => video.removeEventListener("loadedmetadata", jump);
  }, [seekTo]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: APP_ORANGE }}
    >
      {/* Barra de estado del sistema */}
      <div className="relative z-10 flex h-[1.9rem] shrink-0 items-center justify-between px-5 pt-1 text-[9px] font-semibold text-white">
        <span>11:42</span>
        <span className="flex items-center gap-1" aria-hidden>
          <Signal className="h-2.5 w-2.5" />
          <Wifi className="h-2.5 w-2.5" />
          <Battery className="h-3 w-3" />
        </span>
      </div>

      {/* La grabación, a lo ancho de la pantalla */}
      <div className="relative w-full">
        <video
          ref={videoRef}
          src="/video/app-demo.mp4"
          poster="/video/app-demo-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label="Grabación de la app GOGO Food: elegir un producto, añadirlo al carrito y confirmar el pedido"
          className="block w-full"
        />
        {/* Funde el borde inferior del video con el naranja de la app */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5"
          style={{ backgroundImage: `linear-gradient(to top, ${APP_ORANGE}, transparent)` }}
        />
      </div>

      {/* Indicador de inicio, como en el teléfono real */}
      <div className="mt-auto flex justify-center pb-2.5 pt-3">
        <span className="h-1 w-16 rounded-pill bg-white/45" />
      </div>
    </div>
  );
}
