"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { navLinks } from "@/lib/data";
import { useCart } from "@/lib/cart";

/* -------------------------------------------------------------------------- */
/* Partenaires : remplacez par vos vrais logos (dossier /public/partenaires)  */
/* -------------------------------------------------------------------------- */

type Partner = { name: string; src: string; href?: string; tagline?: string };

const partners: Partner[] = [
  {
    name: "CHALO Informatique",
    src: "/chalo-informatique.png",
    tagline: "Votre problème est notre souci",
  },
];

/* -------------------------------------------------------------------------- */
/* CSS (dans le même fichier)                                                 */
/* -------------------------------------------------------------------------- */

const headerCss = `
/* Marge au-dessus du header flottant (se réduit au scroll) */
.hd-wrap { padding-top: .5rem; transition: padding .3s ease; }
@media (min-width: 640px)  { .hd-wrap { padding-top: 1rem; } }
@media (min-width: 1024px) { .hd-wrap { padding-top: 1.5rem; } }
.hd-wrap[data-scrolled="true"] { padding-top: .25rem; }
@media (min-width: 640px)  { .hd-wrap[data-scrolled="true"] { padding-top: .5rem; } }
.hd-wrap { padding-bottom: .5rem; }

/* Capsule flottante */
.hd-pill { transition: box-shadow .3s ease, background-color .3s ease; box-shadow: 0 10px 40px -14px rgba(15,23,42,.16); }
.hd-wrap[data-scrolled="true"] .hd-pill { box-shadow: 0 18px 50px -14px rgba(15,23,42,.26); background-color: rgba(255,255,255,.94); }

.hd-bar { height: 64px; transition: height .3s ease; }
@media (min-width: 640px)  { .hd-bar { height: 72px; } }
@media (min-width: 768px)  { .hd-bar { height: 84px; } }
@media (min-width: 1024px) { .hd-bar { height: 92px; } }
.hd-wrap[data-scrolled="true"] .hd-bar { height: 56px; }
@media (min-width: 640px)  { .hd-wrap[data-scrolled="true"] .hd-bar { height: 64px; } }
@media (min-width: 768px)  { .hd-wrap[data-scrolled="true"] .hd-bar { height: 72px; } }
@media (min-width: 1024px) { .hd-wrap[data-scrolled="true"] .hd-bar { height: 76px; } }

/* Sous-scroll horizontal de la navigation */
.hd-scroll { overflow-x: auto; overscroll-behavior-x: contain; scroll-behavior: smooth; scroll-snap-type: x proximity; scrollbar-width: none; -ms-overflow-style: none; }
.hd-scroll::-webkit-scrollbar { display: none; }
.hd-scroll > ul > li { scroll-snap-align: center; }
.hd-scroll[data-left="true"] { -webkit-mask-image: linear-gradient(to right, transparent, #000 32px); mask-image: linear-gradient(to right, transparent, #000 32px); }
.hd-scroll[data-right="true"] { -webkit-mask-image: linear-gradient(to left, transparent, #000 32px); mask-image: linear-gradient(to left, transparent, #000 32px); }
.hd-scroll[data-left="true"][data-right="true"] { -webkit-mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent); mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent); }

/* Bandeau partenaires : défilement horizontal automatique */
.hd-logo-partner { transition: transform .3s ease; }
a:hover > .hd-logo-partner, .hd-logo-partner:hover { transform: translateY(-1px); }
.hd-fade-x { -webkit-mask-image: linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent); mask-image: linear-gradient(to right, transparent, #000 24px, #000 calc(100% - 24px), transparent); }
/* Un seul logo visible à la fois : chaque "slide" est plus large que le bandeau,
   donc le suivant n'apparaît qu'après la sortie complète du précédent. */
.hd-marquee-wrap { container-type: inline-size; }
.hd-marquee { display: flex; width: max-content; transform: translateX(100cqw); animation: hd-marquee var(--hd-duration, 28s) linear infinite; }
.hd-slide { flex: 0 0 auto; width: calc(100cqw + 22rem); display: flex; align-items: center; }
.hd-marquee-wrap:hover .hd-marquee,
.hd-marquee-wrap:focus-within .hd-marquee { animation-play-state: paused; }
@keyframes hd-marquee {
  from { transform: translateX(100cqw); }
  to   { transform: translateX(calc(100cqw - 50%)); }
}

/* Menus */
.hd-menu { transform-origin: top right; animation: hd-in .2s ease-out both; }
.hd-mobile { animation: hd-fade .25s ease-out both; }
.hd-badge { animation: hd-pop .3s ease-out; }
.hd-backdrop { animation: hd-bg .2s ease-out both; }
@keyframes hd-bg { from { opacity: 0; } to { opacity: 1; } }
@keyframes hd-in { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes hd-fade { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
@keyframes hd-pop { 0% { transform: scale(.6); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .hd-marquee-wrap { overflow-x: auto; }
  .hd-marquee { animation: none; transform: none; }
  .hd-wrap *, .hd-wrap *::before, .hd-wrap *::after { animation: none !important; transition: none !important; }
}
`;

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

function useProfile() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const loadProfile = useCallback(
    async (currentUser: User | null) => {
      setUser(currentUser);

      if (!currentUser) {
        setName("");
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        setName(currentUser.email || "Mon compte");
        setIsAdmin(false);
        return;
      }

      setName(data?.full_name || currentUser.email || "Mon compte");
      setIsAdmin(data?.role === "admin");
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data } = await supabase.auth.getUser();
      if (active) await loadProfile(data.user);
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) void loadProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  async function logout() {
    await supabase.auth.signOut();
  }

  return { user, name, isAdmin, logout };
}

function useDismiss<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  open: boolean,
  onDismiss: () => void
) {
  useEffect(() => {
    if (!open) return;

    function onMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, open, onDismiss]);
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrolled;
}

/* -------------------------------------------------------------------------- */
/* Icônes                                                                     */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  viewBox: "0 0 24 24",
};

function CartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M3 4h2l2.2 10.2a1 1 0 001 .8h8.6a1 1 0 001-.8L19 8H6.2" />
      <circle cx="9" cy="19" r="1.2" />
      <circle cx="17" cy="19" r="1.2" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </svg>
  );
}

function BoxIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </svg>
  );
}

function SettingsIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </svg>
  );
}

function LogoutIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 8l-4 4 4 4M6 12h10" />
    </svg>
  );
}

function ChevronIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg {...iconBase} className="h-6 w-6">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Composants visuels                                                         */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

function Avatar({ initial, size = 40 }: { initial: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-sm ring-2 ring-white"
    >
      {initial}
    </span>
  );
}

function CartLink({
  count,
  withLabel = false,
}: {
  count: number;
  withLabel?: boolean;
}) {
  return (
    <Link
      href="/panier"
      aria-label={`Panier${count > 0 ? `, ${count} article${count > 1 ? "s" : ""}` : ""}`}
      className={`group relative inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md ${
        withLabel ? "w-11 lg:w-auto lg:px-4" : "w-11"
      } ${focusRing}`}
    >
      <CartIcon className="h-[20px] w-[20px]" />
      {withLabel && (
        <span className="hidden text-sm font-medium lg:inline">Panier</span>
      )}

      {count > 0 && (
        <span
          key={count}
          className="hd-badge absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-accent-500 px-1 text-[10px] font-bold text-slate-900"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function PartnerLogo({
  partner,
  showName = false,
  hidden = false,
}: {
  partner: Partner;
  showName?: boolean;
  /** Copie décorative du défilement : exclue de la navigation clavier. */
  hidden?: boolean;
}) {
  const content = (
    <span className="hd-logo-partner flex items-center gap-3">
      <Image
        src={partner.src}
        alt={showName || hidden ? "" : partner.name}
        width={96}
        height={96}
        className="h-9 w-auto shrink-0 object-contain sm:h-12"
      />

      {showName && (
        <span className="leading-tight">
          <span className="block whitespace-nowrap text-xs font-semibold text-slate-800 sm:text-sm">
            {partner.name}
          </span>
          {partner.tagline && (
            <span className="mt-0.5 hidden whitespace-nowrap text-xs text-slate-500 sm:block">
              {partner.tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );

  return partner.href ? (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={partner.name}
      tabIndex={hidden ? -1 : undefined}
      className={`block ${focusRing}`}
    >
      {content}
    </a>
  ) : (
    content
  );
}

/** Bandeau tout en haut : défilement horizontal automatique et continu, pause au survol. */
function PartnersBar() {
  const single = partners.length === 1;

  // Un seul logo visible à la fois : on double la liste pour que la boucle
  // (translateX -50%) soit invisible. ~14 s de traversée par partenaire.
  const track = [...partners, ...partners];
  const duration = `${partners.length * 14}s`;
  const label = single ? "Notre partenaire" : "Nos partenaires";

  return (
    <div className="border-b border-slate-200/70 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-1.5 sm:gap-4 sm:px-6 sm:py-2.5 lg:gap-8 lg:px-8">
        <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
          <span className="sm:hidden">{single ? "Partenaire" : "Partenaires"}</span>
          <span className="hidden sm:inline">{label}</span>
        </p>

        <span
          aria-hidden="true"
          className="h-6 w-px shrink-0 bg-slate-200 sm:h-8"
        />

        <div className="hd-marquee-wrap hd-fade-x min-w-0 flex-1 overflow-hidden">
          <ul
            className="hd-marquee"
            aria-label={label}
            style={{ "--hd-duration": duration } as React.CSSProperties}
          >
            {track.map((partner, i) => {
              const decorative = i >= partners.length;

              return (
                <li
                  key={`${partner.name}-${i}`}
                  aria-hidden={decorative}
                  className="hd-slide"
                >
                  <PartnerLogo
                    partner={partner}
                    showName={single}
                    hidden={decorative}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

type UserAction = {
  href: string;
  label: string;
  icon: React.ReactNode;
  admin?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, name, isAdmin, logout } = useProfile();
  const scrolled = useScrolled();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);
  useDismiss(userMenuRef, userMenuOpen, closeUserMenu);

  /* Sous-scroll de la navigation */
  const navRef = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges((prev) =>
      prev.left === left && prev.right === right ? prev : { left, right }
    );
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);

    const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ inline: "center", block: "nearest" });
    updateEdges();
  }, [pathname, updateEdges]);

  useEffect(() => {
    if (!menuOpen) return;

    // Empêche la page de défiler derrière le menu mobile
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Referme le menu si l'écran passe en mode tablette / ordinateur
    const media = window.matchMedia("(min-width: 768px)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    media.addEventListener("change", onMediaChange);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      media.removeEventListener("change", onMediaChange);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const initial = (name || "?").charAt(0).toUpperCase();
  const firstName = name.split(" ")[0];

  const userActions: UserAction[] = useMemo(
    () => [
      { href: "/profil", label: "Mon profil", icon: <UserIcon /> },
      { href: "/commande", label: "Mes commandes", icon: <BoxIcon /> },
      ...(isAdmin
        ? [{ href: "/admin", label: "Administration", icon: <SettingsIcon />, admin: true }]
        : []),
    ],
    [isAdmin]
  );

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <style>{headerCss}</style>

      {/* Bandeau partenaires (défile avec la page) */}
      <PartnersBar />

      {/* Header flottant, collant en haut, avec marge au-dessus */}
      <header
        className="hd-wrap sticky top-0 z-50 px-2.5 min-[400px]:px-3 sm:px-6 lg:px-8"
        data-scrolled={scrolled}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="hd-pill rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="hd-bar flex items-center justify-between gap-2 px-2.5 sm:gap-3 sm:px-5 lg:px-7">
              {/* Logo */}
              <Link
                href="/"
                aria-label="Accueil"
                className={`group flex shrink-0 items-center ${focusRing}`}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={72}
                  priority
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] min-[400px]:h-10 sm:h-12 lg:h-14"
                />
              </Link>

              {/* Navigation desktop (sous-scroll horizontal) */}
              <nav
                ref={navRef}
                aria-label="Navigation principale"
                onScroll={updateEdges}
                data-left={edges.left}
                data-right={edges.right}
                className="hd-scroll hidden min-w-0 flex-1 px-1 py-2 md:block"
              >
                <ul className="mx-auto flex w-max items-center gap-1 rounded-full bg-slate-100/80 p-1.5 ring-1 ring-slate-200/60">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={`block whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200 lg:px-5 lg:py-2.5 lg:text-sm ${focusRing} ${
                            active
                              ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                              : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Actions desktop */}
              <div className="hidden shrink-0 items-center gap-2.5 md:flex">
                <CartLink count={count} withLabel />

                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((value) => !value)}
                      aria-haspopup="menu"
                      aria-expanded={userMenuOpen}
                      className={`group flex h-11 items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3.5 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/60 hover:shadow-md ${focusRing}`}
                    >
                      <Avatar initial={initial} size={36} />

                      <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 lg:block">
                        {firstName}
                      </span>

                      <ChevronIcon
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {userMenuOpen && (
                      <div
                        role="menu"
                        className="hd-menu absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_24px_60px_-12px_rgba(15,23,42,0.28)]"
                      >
                        <div className="bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar initial={initial} size={48} />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {name}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {user.email}
                              </p>

                              {isAdmin && (
                                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                                  <SettingsIcon className="h-3.5 w-3.5" />
                                  Administrateur
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Mon espace
                          </p>

                          {userActions.map((action) => (
                            <Link
                              key={action.href}
                              href={action.href}
                              role="menuitem"
                              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors duration-150 ${
                                action.admin
                                  ? "font-semibold text-brand-700 hover:bg-brand-50"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                              }`}
                            >
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                                  action.admin
                                    ? "bg-brand-50 text-brand-600"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-600 group-hover:shadow-sm"
                                }`}
                              >
                                {action.icon}
                              </span>

                              <span className="flex-1">{action.label}</span>

                              <ArrowIcon className="h-4 w-4 -translate-x-1 text-slate-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-slate-100 p-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            role="menuitem"
                            className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-red-100 group-hover:text-red-600">
                              <LogoutIcon />
                            </span>
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    aria-label="Se connecter"
                    className={`inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl lg:w-auto lg:px-6 ${focusRing}`}
                  >
                    <UserIcon className="h-[18px] w-[18px]" />
                    <span className="hidden lg:inline">Se connecter</span>
                  </Link>
                )}
              </div>

              {/* Actions mobile */}
              <div className="flex shrink-0 items-center gap-2 md:hidden">
                <CartLink count={count} />

                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                  aria-expanded={menuOpen}
                  aria-controls="menu-mobile"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 ${focusRing}`}
                >
                  <MenuIcon open={menuOpen} />
                </button>
              </div>
            </div>
          </div>

          {/* Menu mobile : panneau flottant sous la capsule */}
          {menuOpen && (
            <>
            {/* Fond assombri : un clic en dehors du menu le ferme */}
            <button
              type="button"
              aria-label="Fermer le menu"
              tabIndex={-1}
              onClick={() => setMenuOpen(false)}
              className="hd-backdrop fixed inset-0 -z-10 bg-slate-900/30 backdrop-blur-[2px] md:hidden"
            />
            <nav
              id="menu-mobile"
              aria-label="Navigation mobile"
              className="hd-mobile absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.3)] md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] transition-colors ${focusRing} ${
                          active
                            ? "bg-brand-600 font-semibold text-white shadow-md shadow-brand-600/25"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                        <ArrowIcon
                          className={`h-4 w-4 ${active ? "text-white/80" : "text-slate-300"}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-3 border-t border-slate-100" />

              {user ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3 bg-slate-50/80 p-4">
                    <Avatar initial={initial} size={44} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>

                      {isAdmin && (
                        <span className="mt-1.5 inline-flex rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                          Administrateur
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2">
                    {userActions.map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-slate-50 ${
                          action.admin ? "font-semibold text-brand-700" : "text-slate-700"
                        }`}
                      >
                        <span className="text-slate-400">{action.icon}</span>
                        {action.label}
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogoutIcon />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/connexion"
                  className={`flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700 ${focusRing}`}
                >
                  <UserIcon />
                  Se connecter à mon compte
                </Link>
              )}
            </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
}