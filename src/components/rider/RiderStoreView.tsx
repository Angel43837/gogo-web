"use client";

import { Coins, Loader2, LogOut, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CTAButton } from "@/components/ui/Button";
import { FormError } from "@/components/forms/FormShell";
import {
  getRiderCoins,
  getRiderSession,
  getRiderStoreItems,
  redeemRiderStoreItem,
  signOutRider,
  type RiderStoreItem,
} from "@/lib/riderAuth";

/**
 * Tienda de coins — protegida del lado del cliente (este sitio no tiene
 * middleware/SSR de sesión, ver src/lib/supabase.ts). Sin sesión de
 * repartidor válida, manda a /login.
 */
export function RiderStoreView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState<RiderStoreItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const session = await getRiderSession();
        if (!session) {
          router.replace("/login?redirect=/tienda");
          return;
        }
        setUserId(session.userId);
        const [riderCoins, storeItems] = await Promise.all([
          getRiderCoins(session.userId),
          getRiderStoreItems(),
        ]);
        setCoins(riderCoins);
        setItems(storeItems);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar la tienda.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedeem = async (item: RiderStoreItem) => {
    if (!userId || coins < item.costCoins || redeemedIds.has(item.id)) return;
    setRedeemingId(item.id);
    setError(null);
    setNotice(null);
    try {
      await redeemRiderStoreItem(userId, item.costCoins);
      setCoins((c) => c - item.costCoins);
      setRedeemedIds((prev) => new Set(prev).add(item.id));
      setNotice(`¡${item.name} canjeado! Un administrador de GOGO se pondrá en contacto contigo.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo canjear. Intenta de nuevo.");
    } finally {
      setRedeemingId(null);
    }
  };

  const handleLogout = async () => {
    await signOutRider();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        Cargando tu tienda…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Coins className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Tus coins</p>
            <p className="font-display text-2xl font-black text-foreground">{coins}</p>
          </div>
        </div>
        <CTAButton variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" aria-hidden />
          Cerrar sesión
        </CTAButton>
      </div>

      {error && <FormError>{error}</FormError>}
      {notice && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          <ShoppingBag className="h-8 w-8" aria-hidden />
          No hay premios disponibles por ahora — vuelve pronto.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const canPay = coins >= item.costCoins;
            const done = redeemedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card"
              >
                <div className="relative flex h-36 items-center justify-center bg-primary/8">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-5xl">{item.emoji}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="font-display text-base font-black text-foreground">{item.name}</p>
                  {item.description && (
                    <p className="line-clamp-2 text-sm text-muted">{item.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="flex items-center gap-1 text-sm font-bold text-primary">
                      <Coins className="h-4 w-4" aria-hidden />
                      {item.costCoins}
                    </span>
                    <CTAButton
                      size="sm"
                      variant={done ? "outline" : "primary"}
                      disabled={done || !canPay || redeemingId === item.id}
                      onClick={() => handleRedeem(item)}
                    >
                      {redeemingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : done ? (
                        "Canjeado"
                      ) : canPay ? (
                        "Canjear"
                      ) : (
                        "Coins insuficientes"
                      )}
                    </CTAButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
