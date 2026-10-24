"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Pages affichées en plein écran, sans header ni footer. */
const bareRoutes = ["/connexion", "/inscription"];

export default function SiteShell({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = bareRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Ces pages ont leur propre <main> : on ne les enveloppe pas une seconde fois.
  if (bare) return <>{children}</>;

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}