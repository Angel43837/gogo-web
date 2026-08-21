import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { footerNav, site } from "@/lib/site";
import { PENDING } from "@/lib/utils";

const columns = [
  { title: "Explorar", links: footerNav.explorar },
  { title: "Ayuda", links: footerNav.ayuda },
  { title: "Legal", links: footerNav.legal },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-brand-deep text-white">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="container relative py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          {/* Marca */}
          <div className="max-w-sm">
            <Logo variant="light" size={64} />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              GOGO conecta personas, restaurantes y repartidores en una sola plataforma de delivery.
            </p>
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Descarga la app
              </p>
              <StoreButtons tone="dark" />
            </div>
          </div>

          {/* Navegación */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  {col.title}
                </h2>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-white/70 transition-colors duration-300 hover:text-primary-soft"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
          {/* Redes sociales y datos de contacto: aún no definidos, no se inventan. */}
          <p className="text-xs text-white/35">
            Contacto y redes sociales: <span className="font-semibold text-white/55">{PENDING}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
