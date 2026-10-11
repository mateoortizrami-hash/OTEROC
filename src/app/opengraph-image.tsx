import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: fundición de plomo y metales no ferrosos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toDataUrl = (file: Buffer) => `data:image/jpeg;base64,${file.toString("base64")}`;

// Imagen que se muestra al compartir el enlace en WhatsApp, redes sociales, etc.
export default async function OpengraphImage() {
  const [background, logo] = (
    await Promise.all([
      readFile(join(process.cwd(), "src/app/og-fondo.jpg")),
      readFile(join(process.cwd(), "public/brand/logo-mark.jpg")),
    ])
  ).map(toDataUrl);

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#183812" }}>
        <img
          src={background}
          alt=""
          width={1200}
          height={675}
          style={{ position: "absolute", top: -22, left: 0, width: 1200, height: 675 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(24,56,18,0.95) 0%, rgba(24,56,18,0.7) 45%, rgba(24,56,18,0) 75%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 640 }}>
          <div style={{ display: "flex", background: "white", borderRadius: 20, padding: 14, width: 156 }}>
            <img src={logo} alt="" width={128} height={113} />
          </div>
          <div style={{ marginTop: 36, fontSize: 58, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
            Inversiones OTEROC
          </div>
          <div style={{ marginTop: 18, fontSize: 30, color: "#ddefd2", lineHeight: 1.3 }}>
            Aprovechamiento y fundición de plomo metálico
          </div>
        </div>
      </div>
    ),
    size,
  );
}
