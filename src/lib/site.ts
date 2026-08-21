/**
 * Configuración central del sitio.
 * Los enlaces externos (tiendas de apps, redes, contacto) están vacíos a propósito:
 * todavía no existen URLs oficiales y no deben inventarse.
 */
export const site = {
  name: "GOGO FOOD",
  shortName: "GOGO",
  tagline: "Tu comida. Tu restaurante. Tu oportunidad.",
  description:
    "GOGO conecta personas, restaurantes y repartidores en una sola plataforma de delivery. Pide lo que quieras, vende más o genera ingresos con tu moto.",
  /** Reemplazar por el dominio oficial cuando esté disponible. */
  url: "https://gogofood.app",
  locale: "es_MX",
} as const;

/** Enlaces de descarga: `href: null` hasta que existan las URLs oficiales. */
export const appStores = [
  { id: "ios", label: "App Store", caption: "Disponible en", href: null as string | null },
  { id: "android", label: "Google Play", caption: "Disponible en", href: null as string | null },
] as const;

export const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Usuarios", href: "/usuarios" },
  { label: "Restaurantes", href: "/restaurantes" },
  { label: "Repartidores", href: "/repartidores" },
  { label: "Bonos", href: "/bonos" },
  { label: "FAQ", href: "/faq" },
] as const;

/**
 * Rutas de producto.
 * Las dos de registro YA están implementadas (formularios conectados a
 * Supabase); el resto sigue reservado para funnels y pantallas futuras.
 */
export const futureRoutes = {
  // Activas
  registroRestaurante: "/registro/restaurante",
  registroRepartidor: "/registro/repartidor",
  // Reservadas
  registro: "/registro",
  login: "/login",
  descarga: "/descarga",
  checkout: "/checkout",
  pago: "/pago",
  promociones: "/promociones",
  dashboard: "/dashboard",
} as const;

export const footerNav = {
  explorar: [
    { label: "Inicio", href: "/" },
    { label: "Cómo funciona", href: "/como-funciona" },
    { label: "Usuarios", href: "/usuarios" },
    { label: "Restaurantes", href: "/restaurantes" },
    { label: "Repartidores", href: "/repartidores" },
    { label: "Bonos", href: "/bonos" },
  ],
  ayuda: [
    { label: "FAQ", href: "/faq" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "/legal/terminos" },
    { label: "Aviso de privacidad", href: "/legal/privacidad" },
  ],
} as const;
