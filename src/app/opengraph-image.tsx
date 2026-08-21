import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "GOGO FOOD — Tu comida. Tu restaurante. Tu oportunidad.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph generada con los colores oficiales de la marca. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #E66113 0%, #B04408 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          GOGO FOOD
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          <span>Tu comida.</span>
          <span>Tu restaurante.</span>
          <span style={{ color: "#D8EDF9" }}>Tu oportunidad.</span>
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 30, opacity: 0.9 }}>
          Usuarios · Restaurantes · Repartidores
        </div>
      </div>
    ),
    size,
  );
}
