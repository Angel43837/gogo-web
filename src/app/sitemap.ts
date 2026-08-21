import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/como-funciona",
  "/usuarios",
  "/restaurantes",
  "/repartidores",
  "/bonos",
  "/faq",
  "/contacto",
  "/descarga",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
