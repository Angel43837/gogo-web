"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Tarjeta flotante que orbita el mockup del Hero. */
export function FloatingBadge({
  icon: Icon,
  title,
  caption,
  className,
  delay = 0,
  drift = 10,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  caption?: string;
  className?: string;
  delay?: number;
  drift?: number;
  accent?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("absolute z-20", className)}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -drift, 0] }}
        transition={{ duration: 4.5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 shadow-card backdrop-blur-md",
          accent
            ? "border-primary/25 bg-primary text-primary-fg shadow-glow"
            : "border-border bg-background/92",
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            accent ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="leading-tight">
          <span
            className={cn(
              "block whitespace-nowrap text-[12px] font-bold",
              accent ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </span>
          {caption && (
            <span
              className={cn(
                "block whitespace-nowrap text-[10px]",
                accent ? "text-white/75" : "text-muted",
              )}
            >
              {caption}
            </span>
          )}
        </span>
      </motion.div>
    </motion.div>
  );
}
