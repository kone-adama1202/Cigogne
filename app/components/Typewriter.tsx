"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  /** Délai entre deux lettres, en millisecondes. */
  speed?: number;
  /** Pause avant de commencer à écrire, en millisecondes. */
  startDelay?: number;
};

/**
 * Affiche un texte lettre par lettre, avec un curseur clignotant.
 * - Le texte complet reste lu par les lecteurs d'écran et visible sans JavaScript.
 * - La place du texte est réservée dès le départ : la mise en page ne bouge pas.
 * - Si l'utilisateur a demandé moins d'animations, le texte s'affiche d'un coup.
 */
export default function Typewriter({
  text,
  speed = 55,
  startDelay = 400,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative block">
        {/* Texte complet invisible : réserve la hauteur et les retours à la ligne */}
        <span className="invisible">{text}</span>
        <span className="absolute inset-0">
          {text.slice(0, count)}
          <span
            className={`ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-white ${
              done ? "animate-pulse motion-reduce:animate-none" : ""
            }`}
          />
        </span>
      </span>
    </>
  );
}