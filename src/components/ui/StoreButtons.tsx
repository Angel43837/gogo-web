import { Apple, Play } from "lucide-react";
import { appStores } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons = { ios: Apple, android: Play } as const;

/**
 * Botones de descarga.
 * Mientras no existan las URLs oficiales se renderizan deshabilitados
 * y etiquetados como "Próximamente" — nunca con enlaces inventados.
 */
export function StoreButtons({
  tone = "dark",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      {appStores.map((store) => {
        const Icon = icons[store.id];
        const disabled = !store.href;

        const inner = (
          <>
            <Icon className="h-6 w-6 shrink-0" aria-hidden />
            <span className="text-left leading-tight">
              <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">
                {store.caption}
              </span>
              <span className="block text-[15px] font-bold">{store.label}</span>
            </span>
          </>
        );

        const classes = cn(
          "inline-flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-300 ease-gogo",
          tone === "dark"
            ? "border-white/20 bg-white/10 text-white"
            : "border-border bg-ink text-white",
          disabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5 hover:shadow-lift",
        );

        if (disabled) {
          return (
            <div key={store.id} className="flex flex-col items-start gap-1.5">
              <button
                type="button"
                disabled
                aria-disabled="true"
                aria-label={`${store.label} — enlace de descarga próximamente`}
                className={classes}
              >
                {inner}
              </button>
              <span
                className={cn(
                  "px-1 text-[10px] font-semibold uppercase tracking-wider",
                  tone === "dark" ? "text-white/55" : "text-muted",
                )}
              >
                Enlace próximamente
              </span>
            </div>
          );
        }

        return (
          <a key={store.id} href={store.href!} className={classes}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}
