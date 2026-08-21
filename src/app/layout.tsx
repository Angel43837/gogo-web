import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GOGO FOOD — Delivery que conecta usuarios, restaurantes y repartidores",
    template: "%s | GOGO FOOD",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "GOGO",
    "GOGO FOOD",
    "delivery",
    "pedidos a domicilio",
    "repartidores",
    "registrar restaurante",
    "app de comida",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: "GOGO FOOD — Tu comida. Tu restaurante. Tu oportunidad.",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "GOGO FOOD — Tu comida. Tu restaurante. Tu oportunidad.",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#E66113",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Datos estructurados de organización. Sin datos de contacto: aún no están definidos. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo/gogo-logo-badge.svg`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                     focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:text-sm
                     focus:font-bold focus:text-primary-fg"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
