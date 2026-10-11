export const site = {
  name: "Inversiones OTEROC S.A.S",
  shortName: "OTEROC",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Aprovechamiento y fundición de metales no ferrosos. Producimos plomo metálico para empresas del mercado nacional e internacional.",
  contact: {
    phone: "+57 317 337 8896",
    phoneHref: "tel:+573173378896",
    whatsappHref: "https://wa.me/573173378896",
    email: "oteroc@oteroc.com",
    location: "Vía Bogotá – Villavicencio, Cáqueza, Cundinamarca, Colombia",
    // Coordenadas de la planta en Google Maps (Plus Code C2CF+2QJ).
    mapQuery: "4.420078,-73.975617",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=4.420078,-73.975617",
  },
  mission:
    "INVERSIONES OTEROC S.A.S es una empresa dedicada al aprovechamiento y fundición de metales no ferrosos; nuestro principal producto es el plomo metálico y se produce con la finalidad de proveer a empresas del mercado nacional e internacional que utilizan estos elementos en sus procesos productivos. Estamos comprometidos con la calidad de nuestros productos y con la conservación del medio ambiente.",
  vision:
    "Para el año 2028 INVERSIONES OTEROC S.A.S será la empresa líder en Colombia en el aprovechamiento del material reciclado y en el suministro de materias primas en el mercado nacional e internacional.",
} as const;

export const policies = [
  {
    title: "Política Integral de HSEQ",
    description:
      "Herramienta de gestión orientada a mejorar la calidad de vida laboral y la competitividad de la organización, promoviendo la seguridad y la salud en el trabajo.",
    href: "/politicas/hseq.pdf",
  },
  {
    title: "Política y Premisas de Responsabilidad Social",
    description:
      "Nuestro compromiso de contribuir activa y voluntariamente a la sociedad mediante una operación sostenible y el relacionamiento con nuestras partes interesadas.",
    href: "/politicas/responsabilidad-social.pdf",
  },
  {
    title: "Política de Seguridad Vial",
    description:
      "Lineamientos para prevenir los riesgos de accidentes de tránsito durante nuestras operaciones en vías públicas y privadas.",
    href: "/politicas/seguridad-vial.pdf",
  },
  {
    title: "Política de Prevención de Consumo de Tabaco, Alcohol y Drogas",
    description:
      "Directrices para proteger la salud y el bienestar de nuestros colaboradores frente al consumo de sustancias.",
    href: "/politicas/prevencion-consumo.pdf",
  },
  {
    title: "Procedimiento para Ingreso de Visitantes",
    description:
      "Estandariza el ingreso, tránsito y salida de visitantes para protegerlos de los riesgos propios de la operación.",
    href: "/politicas/ingreso-visitantes.pdf",
  },
] as const;

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/politicas", label: "Nuestras políticas" },
  { href: "/contacto", label: "Contacto" },
] as const;
