import { useEffect } from "react";

/** One delegated listener also covers buttons mounted after navigation. */
export function useButtonReflection() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReflection = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") return;
      const button =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("button, [data-reflective]")
          : null;
      if (!button || button.matches(":disabled, [aria-disabled='true']")) return;
      const bounds = button.getBoundingClientRect();
      button.style.setProperty("--reflection-x", `${event.clientX - bounds.left}px`);
      button.style.setProperty("--reflection-y", `${event.clientY - bounds.top}px`);
    };
    document.addEventListener("pointermove", updateReflection, { passive: true });
    return () => document.removeEventListener("pointermove", updateReflection);
  }, []);
}
