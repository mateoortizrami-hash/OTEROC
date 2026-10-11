import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ViewTransitionGuard } from "@/components/view-transition-guard";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Fundición de plomo y metales no ferrosos`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#2f6b1d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ViewTransitionGuard />
        {children}
      </body>
    </html>
  );
}
