"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";
type Tag = "div" | "span" | "section" | "ul" | "ol" | "li";

/**
 * Mapa estático de etiquetas animadas.
 * Se define fuera del render para no recrear el componente en cada pasada
 * (lo que remontaría los hijos y relanzaría las animaciones).
 */
const motionTags = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Dirección desde la que entra el contenido. */
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Distancia del desplazamiento inicial, en px. */
  distance?: number;
  as?: Tag;
  once?: boolean;
};

/**
 * Fade in + slide al entrar en el viewport.
 * Respeta `prefers-reduced-motion`: con la preferencia activa el contenido
 * aparece sin desplazamiento.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 24,
  as = "div",
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motionTags[as];

  const variants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, ...offset(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduceMotion ? 0.2 : duration, delay, ease: EASE },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Contenedor que escalona la entrada de sus hijos `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: Tag;
}) {
  const MotionTag = motionTags[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  distance = 22,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: Tag;
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motionTags[as];

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0.2 : 0.55, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
