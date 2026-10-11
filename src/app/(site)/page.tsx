import Image from "next/image";
import { PageTransition } from "@/components/page-transition";
import { NavLink as Link } from "@/components/nav-link";
import { site } from "@/lib/site";

const pillars = [
  {
    title: "Calidad",
    text: "Plomo metálico con estándares que responden a los procesos productivos de nuestros clientes.",
    image: "/images/calidad.jpg",
    alt: "Lingotes de plomo apilados en la bodega de la planta",
    position: "70% center",
  },
  {
    title: "Medio ambiente",
    text: "Aprovechamos material reciclado y operamos con compromiso por la conservación ambiental.",
    image: "/images/ambiente.jpg",
    alt: "Baterías usadas clasificadas para su reciclaje",
    position: "center",
  },
  {
    title: "Seguridad",
    text: "Gestión integral HSEQ para proteger a nuestros colaboradores, visitantes y comunidad.",
    image: "/images/seguridad.jpg",
    alt: "Casco, careta y guantes de protección para fundición",
    position: "center",
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      <>
        <section className="relative isolate overflow-hidden bg-brand-900 text-white">
          <Image
            src="/images/hero-fundicion.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[70%_center]"
          />
          {/* Velo de marca: oscuro a la izquierda para que el texto se lea, deja ver la colada a la derecha */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/90 via-brand-900/55 to-transparent max-md:bg-none max-md:bg-brand-900/60"
          />
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-36">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
              Metales no ferrosos · Colombia
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Aprovechamiento y fundición de plomo metálico
            </h1>
            <p className="mt-6 max-w-xl text-lg text-brand-50">{site.description}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/portal"
                className="rounded-md bg-white px-6 py-3 text-center font-semibold text-brand-800 hover:bg-brand-50"
              >
                Consultar certificados
              </Link>
              <Link
                href="/contacto"
                className="rounded-md border border-white/40 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="nosotros" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="nosotros" className="text-3xl font-bold tracking-tight text-slate-900">
            Quiénes somos
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-semibold text-brand-700">Misión</h3>
              <p className="mt-4 leading-relaxed text-slate-600">{site.mission}</p>
            </article>
            <article className="rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-semibold text-brand-700">Visión</h3>
              <p className="mt-4 leading-relaxed text-slate-600">{site.vision}</p>
            </article>
          </div>
        </section>

        <section aria-labelledby="compromisos" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 id="compromisos" className="text-3xl font-bold tracking-tight text-slate-900">
              Nuestros compromisos
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {pillars.map((p) => (
                <li key={p.title} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: p.position }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-600">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/politicas" className="mt-8 inline-block font-semibold text-brand-700 hover:underline">
              Ver nuestras políticas →
            </Link>
          </div>
        </section>

        <section aria-labelledby="portal" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-brand-100 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-80">
              <Image
                src="/images/control-calidad.jpg"
                alt="Técnicos de OTEROC verificando la calidad de lingotes de plomo en la bodega"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[65%_center]"
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-5 p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Calidad certificada</p>
              <h2 id="portal" className="text-2xl font-bold text-slate-900 md:text-3xl">Portal del cliente</h2>
              <p className="text-slate-600">
                Cada lote de plomo pasa por control de calidad. Consulta y descarga sus certificados desde el portal,
                cuando los necesites.
              </p>
              <Link
                href="/portal"
                className="rounded-md bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800"
              >
                Ingresar al portal
              </Link>
            </div>
          </div>
        </section>
      </>
    </PageTransition>
  );
}
