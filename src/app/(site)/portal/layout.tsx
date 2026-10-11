import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal del cliente",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-slate-50">{children}</div>;
}
