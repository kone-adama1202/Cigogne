"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Photo avec visuel de remplacement : tant que le fichier n'existe pas
 * (ou s'il ne charge pas), un dégradé avec une lettre s'affiche à la place.
 */
export default function PhotoFrame({
  src,
  alt,
  fallbackText,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  position = "50% 50%",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  /** Texte du visuel de remplacement (ex. initiale ou nom de la ville). */
  fallbackText: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
  /** Classes de taille/forme, ex. "aspect-[4/5] rounded-3xl". */
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-slate-100 ${className}`}
    >
      {failed ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-brand-600/25 sm:text-7xl"
        >
          {fallbackText}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectPosition: position }}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
    </div>
  );
}