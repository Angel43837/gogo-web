/**
 * Detección de zona de servicio — portado de `location_service.dart`.
 *
 * Un restaurante nuevo se asigna solo a Maravatío o Acámbaro según qué
 * centro le queda más cerca. Al dueño no se le pregunta, para no complicarle
 * el alta.
 */

/** Centro del municipio de Maravatío, Michoacán. */
const MARAVATIO = { lat: 19.8969, lng: -100.4447 };

/** Centro del municipio de Acámbaro, Guanajuato. */
const ACAMBARO = { lat: 20.0386, lng: -100.7284 };

export type Zona = "maravatio" | "acambaro";

/** Distancia en metros entre dos coordenadas (fórmula del haversine). */
function distanciaMetros(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Zona más cercana a unas coordenadas. */
export function zonaFromCoords(lat: number, lng: number): Zona {
  const dMaravatio = distanciaMetros(lat, lng, MARAVATIO.lat, MARAVATIO.lng);
  const dAcambaro = distanciaMetros(lat, lng, ACAMBARO.lat, ACAMBARO.lng);
  return dAcambaro < dMaravatio ? "acambaro" : "maravatio";
}

export type Coords = { lat: number; lng: number };

/**
 * Geocodifica una dirección con Nominatim (OpenStreetMap).
 *
 * El original usaba la API de Google Maps con una clave incrustada en el
 * código. Nominatim no necesita clave, así que se evita exponer un secreto
 * más. Su política de uso pide un User-Agent identificable y como mucho una
 * petición por segundo: sobra para un formulario de alta.
 */
export async function geocodificar(direccion: string): Promise<Coords | null> {
  const query = direccion.trim();
  if (!query) return null;

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
      encodeURIComponent(`${query}, México`);
    const res = await fetch(url, { headers: { "Accept-Language": "es" } });
    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) return null;

    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

/** Zona a partir de una dirección escrita. Si no se puede resolver, Maravatío. */
export async function detectZona(direccion: string): Promise<Zona> {
  const coords = await geocodificar(direccion);
  return coords ? zonaFromCoords(coords.lat, coords.lng) : "maravatio";
}

/**
 * Geocodificación inversa: de coordenadas a dirección legible.
 * Se usa al pulsar "Usar mi ubicación" para rellenar el campo de dirección.
 */
export async function direccionDesdeCoords(coords: Coords): Promise<string | null> {
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=json" +
      `&lat=${coords.lat}&lon=${coords.lng}`;
    const res = await fetch(url, { headers: { "Accept-Language": "es" } });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      display_name?: string;
      address?: Record<string, string>;
    };
    const a = data.address ?? {};
    const partes = [
      a.road ?? a.pedestrian,
      a.suburb ?? a.neighbourhood ?? a.quarter,
      a.city ?? a.town ?? a.village,
    ].filter(Boolean);

    return partes.length ? partes.join(", ") : (data.display_name ?? null);
  } catch {
    return null;
  }
}

/** Pide la posición del navegador. Devuelve null si se deniega o falla. */
export function posicionActual(): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  });
}
