"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

// Orden de las pestañas en el menú: define si la animación va hacia adelante o atrás.
const TAB_ORDER = ["/", "/politicas", "/contacto", "/portal"];

function tabIndex(path: string) {
  for (let i = TAB_ORDER.length - 1; i > 0; i--) {
    if (path === TAB_ORDER[i] || path.startsWith(`${TAB_ORDER[i]}/`)) return i;
  }
  return 0;
}

/** Link que desliza la página según la posición de la pestaña destino. */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const from = tabIndex(pathname);
  const to = tabIndex(href);
  const transitionTypes = to === from ? undefined : [to > from ? "nav-forward" : "nav-back"];

  return <Link href={href} transitionTypes={transitionTypes} {...props} />;
}
