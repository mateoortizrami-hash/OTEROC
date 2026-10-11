import { NavLink as Link } from "@/components/nav-link";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{site.name}</p>
          <p className="mt-2 text-sm leading-relaxed">{site.description}</p>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Enlaces</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/portal" className="hover:text-white">Portal del cliente</Link>
            </li>
          </ul>
        </nav>

        <address className="not-italic">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={site.contact.phoneHref} className="hover:text-white">{site.contact.phone}</a></li>
            <li><a href={`mailto:${site.contact.email}`} className="hover:text-white">{site.contact.email}</a></li>
            <li>
              <a href={site.contact.mapUrl} target="_blank" rel="noopener" className="hover:text-white">
                {site.contact.location}
              </a>
            </li>
          </ul>
        </address>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs sm:px-6">
          © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
