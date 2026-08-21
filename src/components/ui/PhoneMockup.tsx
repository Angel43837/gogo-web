import type { ReactNode } from "react";
import {
  ArrowLeft,
  Battery,
  Bike,
  ChevronRight,
  CircleCheck,
  Hourglass,
  MapPin,
  Search,
  Signal,
  Store,
  UtensilsCrossed,
  Wifi,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Simulación de la app GOGO Food.

   Reproduce la interfaz real de seguimiento de pedido: mapa a pantalla
   completa, barra de estado flotante arriba y hoja inferior oscura con el
   restaurante, el progreso en cuatro pasos y el botón de cancelar.

   El nombre del restaurante y la dirección son los ejemplos que usa el propio
   formulario de alta ("Tacos El Güero"). No se usan marcas reales: aparecer
   en la web daría a entender una alianza comercial que no existe.
   ========================================================================== */

/** Paleta de la app (tema oscuro), tomada de la interfaz real. */
const app = {
  sheet: "#17171A",
  sheetSoft: "#202024",
  divider: "#2C2C31",
  text: "#FFFFFF",
  muted: "#8E8E93",
  amber: "#F5B800",
  amberSoft: "#4A3A0E",
  orange: "#F7500C",
  orangeSoft: "#3A1B0C",
  danger: "#FF453A",
} as const;

/**
 * Carcasa de smartphone.
 * El contenido interior es una SIMULACIÓN de la interfaz,
 * no una captura real de la aplicación.
 */
export function PhoneMockup({
  children,
  className,
  label = "Interfaz conceptual",
}: {
  children: ReactNode;
  className?: string;
  label?: string | null;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="relative aspect-[9/19] w-full rounded-[2.6rem] border border-white/12 bg-ink p-[0.42rem]
                   shadow-[0_30px_70px_-20px_rgb(16_16_18/0.55),0_0_0_1px_rgb(255_255_255/0.06)_inset]"
      >
        {/* Isla dinámica */}
        <div className="pointer-events-none absolute left-1/2 top-[0.85rem] z-30 h-[1.15rem] w-[30%] -translate-x-1/2 rounded-pill bg-black" />
        {/* Pantalla */}
        <div
          className="relative h-full w-full overflow-hidden rounded-[2.25rem]"
          style={{ backgroundColor: app.sheet }}
        >
          {children}
        </div>
        {/* Reflejo de cristal */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2.6rem] bg-gradient-to-tr from-transparent via-white/6 to-white/12"
        />
      </div>
      {label && (
        <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-current opacity-60">
          {label}
        </p>
      )}
    </div>
  );
}

/** Barra de estado del sistema. `tone` según el fondo que tenga debajo. */
function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 z-20 flex h-[1.9rem] items-center justify-between px-5 pt-1 text-[9px] font-semibold",
        tone === "dark" ? "text-[#1A1A1D]" : "text-white",
      )}
    >
      <span>11:42</span>
      <span className="flex items-center gap-1" aria-hidden>
        <Signal className="h-2.5 w-2.5" />
        <Wifi className="h-2.5 w-2.5" />
        <Battery className="h-3 w-3" />
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Mapa
   -------------------------------------------------------------------------- */

/**
 * Mapa estilizado al gusto de OpenStreetMap.
 * Se dibuja en SVG en lugar de cargar tiles: sin clave de API, sin peticiones
 * externas y sin depender de que el usuario tenga conexión.
 */
function MapCanvas() {
  return (
    <svg
      viewBox="0 0 200 380"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <rect width="200" height="380" fill="#EDEAE3" />

      {/* Manzanas de parque */}
      <rect x="8" y="86" width="40" height="26" rx="3" fill="#CCE4C2" />
      <rect x="150" y="150" width="46" height="34" rx="3" fill="#CCE4C2" />
      <rect x="18" y="250" width="30" height="22" rx="3" fill="#CCE4C2" />

      {/* Río / vía del tren */}
      <path
        d="M118 0 C 126 46, 104 78, 112 118 S 132 176, 124 216 S 108 300, 118 380"
        fill="none"
        stroke="#B9CFE3"
        strokeWidth="5"
      />

      {/* Retícula de calles secundarias */}
      <g stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round">
        <path d="M0 60 H98" />
        <path d="M0 104 H96" />
        <path d="M0 148 H100" />
        <path d="M0 196 H104" />
        <path d="M0 300 H108" />
        <path d="M0 340 H112" />
        <path d="M130 44 H200" />
        <path d="M134 96 H200" />
        <path d="M128 250 H200" />
        <path d="M120 320 H200" />
        <path d="M22 0 V232" />
        <path d="M52 0 V232" />
        <path d="M80 0 V232" />
        <path d="M40 262 V380" />
        <path d="M76 262 V380" />
        <path d="M158 0 V150" />
        <path d="M180 186 V380" />
      </g>

      {/* Avenidas principales */}
      <g fill="none" strokeLinecap="round">
        <path d="M0 232 H200" stroke="#E4B678" strokeWidth="9" />
        <path d="M0 232 H200" stroke="#F2C48A" strokeWidth="7" />
        <path d="M148 0 C 150 60, 138 120, 150 190 S 168 300, 160 380" stroke="#F2C48A" strokeWidth="6" />
      </g>

      {/* Etiquetas de calles */}
      <g fill="#8C8C8C" fontSize="4.6" fontFamily="system-ui, sans-serif">
        <text x="6" y="56">Calle Morelos</text>
        <text x="6" y="144">Calle Galeana</text>
        <text x="6" y="296">Calle Zaragoza</text>
        <text x="136" y="40">Calle Casa Blanca</text>
        <text x="132" y="246">Av. Zapata</text>
      </g>
      <text x="10" y="226" fill="#5B5B5B" fontSize="7.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        Maravatío
      </text>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Pantalla 1 — Seguimiento del pedido (la de la app real)
   -------------------------------------------------------------------------- */

const steps = [
  { label: "Recibido", icon: Hourglass, state: "active" },
  { label: "Preparando", icon: UtensilsCrossed, state: "idle" },
  { label: "En camino", icon: Bike, state: "idle" },
  { label: "Entregado", icon: CircleCheck, state: "idle" },
] as const;

export function ScreenTracking() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Mapa a pantalla completa */}
      <MapCanvas />
      <StatusBar tone="dark" />

      {/* Recorrido animado del pedido — se conserva tal cual */}
      <svg viewBox="0 0 200 380" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M34 300 C 74 300, 70 214, 106 206 S 152 118, 172 96"
          fill="none"
          stroke={app.orange}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="9 8"
          className="animate-dash-move"
        />
        {/* Origen: el restaurante */}
        <circle cx="34" cy="300" r="6" fill="#1A1A1D" stroke="#FFFFFF" strokeWidth="2" />
        {/* Destino */}
        <circle cx="172" cy="96" r="6" fill={app.orange} stroke="#FFFFFF" strokeWidth="2" />
      </svg>

      {/* Repartidor en movimiento */}
      <div className="absolute left-[53%] top-[54%] z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#F7500C]/40" />
        <span
          className="relative flex h-7 w-7 items-center justify-center rounded-full text-white shadow-[0_6px_16px_rgba(247,80,12,0.5)]"
          style={{ backgroundColor: app.orange }}
        >
          <Bike className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Marcador de casa (destino del cliente) */}
      <div className="absolute left-[86%] top-[25%] z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-white bg-[#2E86F0] shadow-md">
          <MapPin className="h-3 w-3 text-white" />
        </span>
      </div>

      {/* Barra de estado flotante */}
      <div className="absolute inset-x-2.5 top-[2.1rem] z-20 flex items-center gap-1.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: app.sheet }}
        >
          <ArrowLeft className="h-3.5 w-3.5 text-white" />
        </span>
        <div
          className="flex flex-1 items-center gap-2 rounded-2xl px-2 py-1.5"
          style={{ backgroundColor: app.sheet }}
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: app.amberSoft }}
          >
            <Hourglass className="h-3 w-3" style={{ color: app.amber }} />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-bold text-white">Pedido recibido</span>
            <span className="block text-[8px]" style={{ color: app.muted }}>
              Esperando confirmación
            </span>
          </span>
        </div>
      </div>

      {/* Hoja inferior */}
      <div
        className="absolute inset-x-2 bottom-2.5 z-20 rounded-[1.15rem] px-3 pb-3 pt-2"
        style={{ backgroundColor: app.sheet }}
      >
        <div className="mx-auto mb-2.5 h-[3px] w-8 rounded-pill" style={{ backgroundColor: app.divider }} />

        {/* Restaurante y total */}
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: app.orangeSoft }}
          >
            <Store className="h-4 w-4" style={{ color: app.orange }} />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[12px] font-bold text-white">Tacos El Güero</span>
            <span className="block truncate text-[9px]" style={{ color: app.muted }}>
              Calle Morelos 45, Centro
            </span>
          </span>
          <span className="shrink-0 text-[12px] font-black" style={{ color: app.orange }}>
            $70 MXN
          </span>
        </div>

        <div className="my-2.5 h-px w-full" style={{ backgroundColor: app.divider }} />

        {/* Progreso en cuatro pasos */}
        <ol className="flex items-start justify-between">
          {steps.map((step) => {
            const active = step.state === "active";
            return (
              <li key={step.label} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full",
                    active && "border-2",
                  )}
                  style={active ? { borderColor: app.amber } : undefined}
                >
                  <step.icon
                    className="h-3.5 w-3.5"
                    style={{ color: active ? app.amber : "#5A5A60" }}
                  />
                </span>
                <span
                  className="text-[7.5px] font-semibold"
                  style={{ color: active ? app.text : app.muted }}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Cancelar pedido */}
        <div
          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border py-2"
          style={{ borderColor: app.danger }}
        >
          <XCircle className="h-3 w-3" style={{ color: app.danger }} />
          <span className="text-[10px] font-bold" style={{ color: app.danger }}>
            Cancelar pedido
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Pantalla 2 — Descubrir restaurantes
   Mismo lenguaje visual que la pantalla real: tema oscuro, naranja de marca.
   -------------------------------------------------------------------------- */

export function ScreenDiscover() {
  const categories = ["Antojitos", "Pizza", "Postres", "Mariscos"];

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: "#0F0F11" }}>
      <StatusBar tone="light" />

      <div className="flex flex-col gap-2.5 px-3 pb-3 pt-[2.2rem]">
        {/* Dirección de entrega */}
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" style={{ color: app.orange }} />
          <span className="text-[9px] font-bold text-white">Entregar en</span>
          <span className="text-[9px]" style={{ color: app.muted }}>
            Tu dirección
          </span>
          <ChevronRight className="ml-auto h-3 w-3" style={{ color: app.muted }} />
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-2"
          style={{ backgroundColor: app.sheetSoft }}
        >
          <Search className="h-3 w-3" style={{ color: app.muted }} />
          <span className="text-[9px]" style={{ color: app.muted }}>
            Buscar restaurantes o platillos
          </span>
        </div>

        {/* Categorías */}
        <div className="flex gap-1.5">
          {categories.map((category, i) => (
            <span
              key={category}
              className="rounded-pill px-2.5 py-1 text-[8px] font-bold"
              style={
                i === 0
                  ? { backgroundColor: app.orange, color: "#FFFFFF" }
                  : { backgroundColor: app.sheetSoft, color: app.muted }
              }
            >
              {category}
            </span>
          ))}
        </div>

        {/* Destacado */}
        <div
          className="relative h-[4.6rem] shrink-0 overflow-hidden rounded-xl p-2.5"
          style={{ backgroundColor: app.orange }}
        >
          <p className="text-[8px] font-black uppercase tracking-wide text-white/85">Destacado</p>
          <p className="mt-0.5 font-display text-[13px] font-black leading-tight text-white">
            Lo que se te
            <br />
            antoja, cerca.
          </p>
          <div className="absolute -bottom-5 -right-4 h-16 w-16 rounded-full bg-white/15" />
        </div>

        {/* Listado */}
        <div className="flex flex-col gap-1.5">
          {[
            { name: "Tacos El Güero", tag: "Antojitos · 20-30 min" },
            { name: "La Pizzería", tag: "Pizza · 25-35 min" },
            { name: "Postres Lupita", tag: "Postres · 15-25 min" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 rounded-xl p-1.5"
              style={{ backgroundColor: app.sheetSoft }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: app.orangeSoft }}
              >
                <Store className="h-3.5 w-3.5" style={{ color: app.orange }} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[9.5px] font-bold text-white">{item.name}</span>
                <span className="block truncate text-[8px]" style={{ color: app.muted }}>
                  {item.tag}
                </span>
              </span>
              <ChevronRight className="h-3 w-3 shrink-0" style={{ color: app.muted }} />
            </div>
          ))}
        </div>
      </div>

      {/* Barra de navegación inferior */}
      <div
        className="mt-auto flex items-center justify-around border-t px-2 py-2.5"
        style={{ borderColor: app.divider, backgroundColor: app.sheet }}
      >
        {[
          { icon: Search, label: "Explorar", active: true },
          { icon: UtensilsCrossed, label: "Pedidos", active: false },
          { icon: MapPin, label: "Seguir", active: false },
        ].map((tab) => (
          <span key={tab.label} className="flex flex-col items-center gap-0.5">
            <tab.icon className="h-3.5 w-3.5" style={{ color: tab.active ? app.orange : app.muted }} />
            <span
              className="text-[7px] font-bold"
              style={{ color: tab.active ? app.orange : app.muted }}
            >
              {tab.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
