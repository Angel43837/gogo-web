import type { SVGProps } from "react";

/* ==========================================================================
   Iconos propios, dibujados en el mismo lenguaje visual que Lucide:
   rejilla de 24×24, solo trazo, grosor 2, extremos y uniones redondeados y
   `currentColor` para que hereden el color del contenedor.
   ========================================================================== */

const base: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/**
 * Motocicleta.
 * Lucide no incluye ninguna, así que se dibuja con las mismas proporciones
 * que su icono `Bike` (ruedas de radio 3.5 centradas en y = 17.5).
 */
export function Motorcycle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      {/* Chasis: del eje trasero al asiento y de ahí al eje delantero */}
      <path d="M5.5 17.5 8.5 10.5h6l3.5 7" />
      {/* Horquilla y manillar */}
      <path d="M14.5 10.5 16.5 6.5H20" />
    </svg>
  );
}
