import Image from "next/image";

/** Encabezado de página con foto de fondo y velo de marca para que el texto se lea. */
export function PageHero({
  image,
  title,
  description,
  objectPosition = "center",
  split = false,
}: {
  image: string;
  title: string;
  description: string;
  objectPosition?: string;
  /** Texto sobre fondo verde a la izquierda y foto a la derecha, para fotos con el motivo al centro. */
  split?: boolean;
}) {
  if (split) {
    return (
      <section className="grid bg-brand-900 text-white md:grid-cols-2">
        <div className="relative aspect-[16/9] md:order-2 md:aspect-auto md:min-h-80">
          <Image src={image} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ objectPosition }} />
        </div>
        <div className="flex items-center px-4 py-12 sm:px-6 md:py-20 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-md text-lg text-brand-50">{description}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
        style={{ objectPosition }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/90 via-brand-900/60 to-brand-900/10 max-md:bg-none max-md:bg-brand-900/65"
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-brand-50">{description}</p>
      </div>
    </section>
  );
}
