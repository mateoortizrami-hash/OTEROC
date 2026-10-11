"use client";

import Image from "next/image";
import { NavLink as Link } from "@/components/nav-link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-24">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-mark.jpg"
            alt={site.name}
            width={134}
            height={118}
            priority
            className="h-16 w-auto md:h-20"
          />
          <span className="sr-only">{site.name}</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 aria-[current=page]:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="ml-3 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Portal del cliente
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Principal" className="border-t border-slate-200 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
              className="block rounded-md px-3 py-3 text-base font-medium text-slate-700 aria-[current=page]:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-brand-700 px-3 py-3 text-center text-base font-semibold text-white"
          >
            Portal del cliente
          </Link>
        </nav>
      )}
    </header>
  );
}
