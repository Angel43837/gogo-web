/* ==========================================================================
   ARQUITECTURA OPERATIVA — repartidores y pedidos.

   Esto NO se usa en la web: son los contratos de datos que consumirá la
   aplicación para repartidores y el panel administrativo. Vive aquí para que
   los tres proyectos hablen exactamente los mismos identificadores en lugar
   de inventar cada uno los suyos.

   La web solo REGISTRA. Conectarse, aceptar pedidos, navegar y cobrar son
   funciones de la app.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Disponibilidad del repartidor
   -------------------------------------------------------------------------- */

export type DriverAvailability = "desconectado" | "disponible";

export const availabilityStates = [
  {
    id: "desconectado",
    label: "Desconectado",
    indicator: "🔴",
    description: "No se le asignan pedidos nuevos.",
    /**
     * Con el repartidor desconectado la app DEJA de compartir su ubicación,
     * conforme a la política de privacidad de la plataforma.
     */
    sharesLocation: false,
  },
  {
    id: "disponible",
    label: "Disponible",
    indicator: "🟢",
    description: "Entra en el reparto de pedidos de su zona.",
    sharesLocation: true,
  },
] as const;

/* --------------------------------------------------------------------------
   Ciclo de vida de un pedido
   -------------------------------------------------------------------------- */

export type OrderStage =
  | "pedido_recibido"
  | "buscando_repartidor"
  | "repartidor_asignado"
  | "repartidor_acepto"
  | "en_camino_restaurante"
  | "en_restaurante"
  | "pedido_recogido"
  | "en_camino_cliente"
  | "entregado";

export type OrderStageDefinition = {
  id: OrderStage;
  label: string;
  /** Quién hace avanzar el pedido a la siguiente etapa. */
  actor: "sistema" | "restaurante" | "repartidor";
  description: string;
};

export const orderStages: OrderStageDefinition[] = [
  {
    id: "pedido_recibido",
    label: "Pedido recibido",
    actor: "sistema",
    description: "El cliente confirmó y pagó el pedido.",
  },
  {
    id: "buscando_repartidor",
    label: "Buscando repartidor",
    actor: "sistema",
    description: "Se busca entre los repartidores disponibles de la zona.",
  },
  {
    id: "repartidor_asignado",
    label: "Repartidor asignado",
    actor: "sistema",
    description: "Se le ofrece el pedido a un repartidor concreto.",
  },
  {
    id: "repartidor_acepto",
    label: "Repartidor aceptó",
    actor: "repartidor",
    description: "El repartidor tomó el pedido.",
  },
  {
    id: "en_camino_restaurante",
    label: "En camino al restaurante",
    actor: "repartidor",
    description: "Va hacia el punto de recogida.",
  },
  {
    id: "en_restaurante",
    label: "En el restaurante",
    actor: "repartidor",
    description: "Llegó y espera el pedido.",
  },
  {
    id: "pedido_recogido",
    label: "Pedido recogido",
    actor: "repartidor",
    description: "El pedido ya va con el repartidor.",
  },
  {
    id: "en_camino_cliente",
    label: "En camino al cliente",
    actor: "repartidor",
    description: "Se dirige a la dirección de entrega.",
  },
  {
    id: "entregado",
    label: "Entregado",
    actor: "repartidor",
    description: "El cliente recibió su pedido.",
  },
];

export const orderStageById = Object.fromEntries(
  orderStages.map((s) => [s.id, s]),
) as Record<OrderStage, OrderStageDefinition>;

/** Etapas en las que el repartidor debe compartir ubicación en tiempo real. */
export const stagesWithLiveTracking: OrderStage[] = [
  "repartidor_acepto",
  "en_camino_restaurante",
  "en_restaurante",
  "pedido_recogido",
  "en_camino_cliente",
];
