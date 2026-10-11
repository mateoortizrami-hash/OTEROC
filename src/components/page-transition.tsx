import { ViewTransition } from "react";

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/** Envuelve el contenido de cada página para que se deslice al cambiar de pestaña. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
