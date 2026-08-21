/**
 * ARCHIVO GENERADO por scripts/prepare-video.mjs — no editar a mano.
 * Para regenerarlo:  npm run video
 */

export const scrollFrames = {
  /** Número de fotogramas de cada juego. */
  count: 72,
  /** Dígitos del nombre de archivo: 001.webp, 002.webp... */
  pad: 3,
  desktop: { dir: "/video/frames/desktop", width: 1280, height: 720 },
  mobile: { dir: "/video/frames/mobile", width: 768, height: 432 },
} as const;

export type ScrollFrameVariant = keyof Omit<typeof scrollFrames, "count" | "pad">;
