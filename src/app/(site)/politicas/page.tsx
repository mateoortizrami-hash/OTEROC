import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import type { Metadata } from "next";
import { policies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nuestras políticas",
  description:
    "Políticas corporativas de Inversiones OTEROC: HSEQ, responsabilidad social, seguridad vial, prevención de consumo e ingreso de visitantes.",
};

export default function PoliticasPage() {
  return (
    <PageTransition>
      <PageHero
        image="/images/politicas.jpg"
        split
        objectPosition="85% 15%"
        title="Nuestras políticas"
        description="Conoce los lineamientos que orientan nuestra operación en calidad, seguridad, salud en el trabajo y responsabilidad social."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ul className="grid gap-6 md:grid-cols-2">
          {policies.map((policy) => (
            <li key={policy.href} className="flex flex-col rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">{policy.title}</h2>
              <p className="mt-3 flex-1 leading-relaxed text-slate-600">{policy.description}</p>
              <a
                href={policy.href}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-md border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Ver documento (PDF)
                <span className="sr-only">: {policy.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageTransition>
  );
}
