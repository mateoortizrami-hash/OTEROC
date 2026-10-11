import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Comunícate con ${site.name}. Teléfono ${site.contact.phone} · ${site.contact.email}.`,
};

const mapQuery = encodeURIComponent(site.contact.mapQuery);
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=16&hl=es&output=embed`;
const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

const channels = [
  { label: "Teléfono", value: site.contact.phone, href: site.contact.phoneHref },
  { label: "WhatsApp", value: site.contact.phone, href: site.contact.whatsappHref },
  { label: "Correo electrónico", value: site.contact.email, href: `mailto:${site.contact.email}` },
];

export default function ContactoPage() {
  return (
    <PageTransition>
      <PageHero
        image="/images/contacto.jpg"
        objectPosition="70% center"
        title="Contacto"
        description="Estamos atentos a tus preguntas, comentarios y solicitudes comerciales. Visítanos en nuestra planta en Cáqueza, Cundinamarca."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <li key={c.label} className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{c.label}</p>
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener" : undefined}
                  className="mt-2 block text-lg font-medium text-slate-900 hover:text-brand-700"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-2 text-lg font-medium text-slate-900">{c.value}</p>
              )}
            </li>
          ))}
        </ul>

        <section aria-labelledby="ubicacion" className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="ubicacion" className="text-2xl font-bold text-slate-900">Ubicación</h2>
              <p className="mt-1 text-slate-600">{site.contact.location}</p>
            </div>
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex w-fit items-center rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Cómo llegar
            </a>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-slate-200">
            <iframe
              src={mapEmbedUrl}
              title={`Mapa de ubicación de ${site.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block aspect-[4/3] w-full border-0 sm:aspect-[16/7]"
            />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
