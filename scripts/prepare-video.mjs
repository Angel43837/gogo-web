/**
 * Prepara la secuencia de fotogramas del scroll.
 *
 * Por qué imágenes y no un video: para hacer scrubbing con el scroll hay que
 * saltar a un instante concreto en cada frame de scroll. Un video comprimido
 * obliga al navegador a decodificar desde el keyframe anterior en cada salto,
 * así que se congela. Con una secuencia de imágenes cada salto es "pintar la
 * imagen N": coste constante, y además carga progresivamente — se puede empezar
 * a ver con las primeras imágenes descargadas.
 *
 * Genera dos juegos (escritorio y móvil) y un archivo TypeScript con los datos
 * para que el componente y las imágenes no se desincronicen.
 *
 * Uso:  npm run video
 * Coloca el archivo fuente en la carpeta `Video scroll/`.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const SOURCE_DIR = "Video scroll";
const FRAMES_DIR = path.join("public", "video", "frames");
const MANIFEST = path.join("src", "data", "scrollFrames.ts");

/**
 * Fotogramas por segundo de la secuencia.
 * 9 es suficiente: el usuario marca el ritmo con el scroll, así que no se
 * percibe como un video a cámara lenta. Subirlo multiplica el peso.
 */
const FPS = 9;

/** Un juego por tamaño de pantalla. `quality` es la calidad WebP (0-100). */
const VARIANTS = [
  { name: "desktop", width: 1280, quality: 62 },
  { name: "mobile", width: 768, quality: 64 },
];

if (!existsSync(SOURCE_DIR)) {
  console.error(`No existe la carpeta "${SOURCE_DIR}".`);
  process.exit(1);
}

const source = readdirSync(SOURCE_DIR).find((f) => /\.(mp4|mov|m4v|webm|avi)$/i.test(f));

if (!source) {
  console.error(`No se encontró ningún video dentro de "${SOURCE_DIR}".`);
  process.exit(1);
}

const input = path.join(SOURCE_DIR, source);
console.log(`Origen: ${input}`);

const results = [];

for (const variant of VARIANTS) {
  const outDir = path.join(FRAMES_DIR, variant.name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  console.log(`Extrayendo "${variant.name}" (${variant.width}px, ${FPS} fps)...`);

  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-loglevel", "error",
      "-i", input,
      // `-2` mantiene la proporción y fuerza un alto par (lo exige el códec).
      "-vf", `fps=${FPS},scale=${variant.width}:-2`,
      "-c:v", "libwebp",
      "-quality", String(variant.quality),
      "-compression_level", "6",
      path.join(outDir, "%03d.webp"),
    ],
    { stdio: "inherit" },
  );

  const files = readdirSync(outDir);
  const bytes = files.reduce((sum, f) => sum + statSync(path.join(outDir, f)).size, 0);
  const height = Math.round((variant.width * 9) / 16 / 2) * 2;

  results.push({ ...variant, height, count: files.length, bytes });
  console.log(
    `  ${files.length} fotogramas · ${(bytes / 1048576).toFixed(2)} MB · ` +
      `${Math.round(bytes / files.length / 1024)} KB por fotograma`,
  );
}

// Todos los juegos deben tener el mismo número de fotogramas.
const count = results[0].count;
if (results.some((r) => r.count !== count)) {
  console.error("Los juegos no tienen el mismo número de fotogramas.");
  process.exit(1);
}

const variantsTs = results
  .map(
    (r) =>
      `  ${r.name}: { dir: "/video/frames/${r.name}", width: ${r.width}, height: ${r.height} },`,
  )
  .join("\n");

writeFileSync(
  MANIFEST,
  `/**
 * ARCHIVO GENERADO por scripts/prepare-video.mjs — no editar a mano.
 * Para regenerarlo:  npm run video
 */

export const scrollFrames = {
  /** Número de fotogramas de cada juego. */
  count: ${count},
  /** Dígitos del nombre de archivo: 001.webp, 002.webp... */
  pad: 3,
${variantsTs}
} as const;

export type ScrollFrameVariant = keyof Omit<typeof scrollFrames, "count" | "pad">;
`,
  "utf8",
);

const totalMb = results.reduce((s, r) => s + r.bytes, 0) / 1048576;
console.log(`\nManifiesto: ${MANIFEST}`);
console.log(`Total en disco: ${totalMb.toFixed(2)} MB (el navegador descarga solo un juego)`);
