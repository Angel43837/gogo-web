/**
 * Prepara la grabación de pantalla de la app para el mockup del teléfono.
 *
 * A diferencia del plano del scroll, este video se reproduce en bucle de
 * principio a fin, así que no necesita ser all-intra: basta con recortarlo,
 * quitarle el audio y dejarlo ligero.
 *
 * Qué hace:
 *  1. RECORTA el cromo del navegador (barra de estado + URL arriba, barra de
 *     herramientas abajo) para que parezca la app y no una captura de Safari.
 *  2. CORTA los primeros segundos, donde la lista muestra marcas de terceros
 *     (Starbucks, McDonald's). Publicarlas en la web de GOGO daría a entender
 *     una alianza comercial; ver TRIM_START abajo.
 *  3. Quita el audio y aplica faststart.
 *
 * Uso:  npm run demo
 * Coloca el archivo fuente en la carpeta `video demo app/`.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const SOURCE_DIR = "video demo app";
const OUTPUT = path.join("public", "video", "app-demo.mp4");
const POSTER = path.join("public", "video", "app-demo-poster.jpg");

/** Segundo en el que empieza el recorte (ya no se ven marcas de terceros). */
const TRIM_START = 6.5;

/** Duración del clip resultante, en segundos. */
const TRIM_DURATION = 17.5;

/**
 * Recorte del cromo del navegador, en píxeles del original (384x832):
 * `ancho:alto:x:y`. Arriba se van 90 px (estado + URL) y abajo 80 px
 * (barra de herramientas de Safari).
 */
const CROP = "384:662:0:90";

/** Calidad: más bajo = mejor imagen y más peso. */
const CRF = 26;

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
mkdirSync(path.dirname(OUTPUT), { recursive: true });

console.log(`Origen:  ${input}`);
console.log(`Recorte: desde ${TRIM_START}s, ${TRIM_DURATION}s, crop ${CROP}`);

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-loglevel", "error",
    "-ss", String(TRIM_START),
    "-t", String(TRIM_DURATION),
    "-i", input,
    "-vf", `crop=${CROP}`,
    // Sin audio: el video va silenciado en la web.
    "-an",
    "-c:v", "libx264",
    "-preset", "slower",
    "-crf", String(CRF),
    "-pix_fmt", "yuv420p",
    "-profile:v", "high",
    "-movflags", "+faststart",
    OUTPUT,
  ],
  { stdio: "inherit" },
);

const mb = (statSync(OUTPUT).size / 1048576).toFixed(2);
console.log(`Video listo: ${OUTPUT} (${mb} MB)`);

// Póster: evita que el hueco quede negro mientras carga.
execFileSync(
  ffmpegPath,
  ["-y", "-loglevel", "error", "-ss", "1", "-i", OUTPUT, "-frames:v", "1", "-q:v", "4", POSTER],
  { stdio: "inherit" },
);

const kb = (statSync(POSTER).size / 1024).toFixed(0);
console.log(`Póster listo: ${POSTER} (${kb} KB)`);
