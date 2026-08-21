"use client";

import "leaflet/dist/leaflet.css";
import { Crosshair, Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { direccionDesdeCoords, geocodificar, posicionActual, zonaFromCoords } from "@/lib/zona";
import type { Coords } from "@/lib/zona";

/**
 * Selector de ubicación sobre un mapa real (Leaflet + teselas de
 * OpenStreetMap). Se eligió OSM en lugar de Google Maps porque no necesita
 * clave de API: un secreto menos que gestionar.
 *
 * Leaflet toca `window` al importarse, así que se carga dinámicamente dentro
 * de un efecto para no romper el render en servidor.
 */
export function LocationPicker({
  value,
  address,
  onChange,
}: {
  value: Coords | null;
  /** Dirección escrita en el formulario, para poder buscarla en el mapa. */
  address: string;
  onChange: (coords: Coords, addressFromMap?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Centro por defecto: Maravatío, la zona principal de servicio.
  const start = value ?? { lat: 19.8969, lng: -100.4447 };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [start.lat, start.lng],
        zoom: value ? 16 : 13,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      // Marcador propio: el icono por defecto de Leaflet depende de rutas
      // de imagen que el bundler no resuelve.
      const icon = L.divIcon({
        className: "",
        html:
          '<span style="display:flex;height:2rem;width:2rem;transform:translate(-50%,-100%);' +
          'align-items:center;justify-content:center;border-radius:9999px 9999px 9999px 2px;' +
          'background:rgb(247,80,12);box-shadow:0 6px 16px rgba(0,0,0,.35);rotate:45deg">' +
          '<span style="height:.6rem;width:.6rem;border-radius:9999px;background:#fff"></span></span>',
        iconSize: [0, 0],
      });

      const marker = L.marker([start.lat, start.lng], { draggable: true, icon }).addTo(map);

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onChangeRef.current({ lat, lng });
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
      setReady(true);

      // El contenedor suele montarse con tamaño 0 dentro del wizard.
      setTimeout(() => map.invalidateSize(), 60);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Solo debe crearse una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Mueve el mapa cuando las coordenadas cambian desde fuera. */
  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([value.lat, value.lng]);
    mapRef.current.setView([value.lat, value.lng], 16);
  }, [value]);

  const usarMiUbicacion = async () => {
    setLoading(true);
    try {
      const pos = await posicionActual();
      if (!pos) return;
      const found = await direccionDesdeCoords(pos);
      onChange(pos, found ?? undefined);
    } finally {
      setLoading(false);
    }
  };

  const buscarDireccion = async () => {
    if (!address.trim()) return;
    setLoading(true);
    try {
      const coords = await geocodificar(address);
      if (coords) onChange(coords);
    } finally {
      setLoading(false);
    }
  };

  const zona = value ? zonaFromCoords(value.lat, value.lng) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={usarMiUbicacion}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:border-primary/50 hover:text-primary disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Crosshair className="h-4 w-4" aria-hidden />
          )}
          Usar mi ubicación
        </button>
        <button
          type="button"
          onClick={buscarDireccion}
          disabled={loading || !address.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:border-primary/50 hover:text-primary disabled:opacity-60"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          Buscar la dirección escrita
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div ref={containerRef} className="h-64 w-full bg-surface sm:h-72" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <Loader2 className="h-5 w-5 animate-spin text-muted" aria-hidden />
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Arrastra el marcador o toca el mapa para ajustar el punto exacto. Esta ubicación
        determinará tu <strong className="text-foreground">zona de servicio</strong> y la
        cobertura de entregas.
      </p>

      {value && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-primary/5 px-3.5 py-2.5 text-xs">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="font-semibold text-foreground">
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
          {zona && (
            <span className="rounded-pill bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-fg">
              Zona {zona}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
