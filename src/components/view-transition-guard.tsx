"use client";

import { useEffect } from "react";

/**
 * Si una navegación empieza con la pestaña en segundo plano, el navegador aborta la
 * View Transition y rechaza su promesa ("Document hidden"). La navegación termina
 * igual; solo se omite la animación. Silenciamos únicamente ese caso.
 */
function isAbortedViewTransition(reason: unknown) {
  return (
    reason instanceof DOMException &&
    (reason.name === "InvalidStateError" || reason.name === "AbortError") &&
    /transition was (aborted|skipped)/i.test(reason.message)
  );
}

export function ViewTransitionGuard() {
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isAbortedViewTransition(e.reason)) e.preventDefault();
    };
    const onError = (e: ErrorEvent) => {
      if (isAbortedViewTransition(e.error)) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
