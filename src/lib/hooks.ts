import type { RefObject } from "react";

import { useCallback, useEffect, useState } from "react";

export function useScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}

export function useOutsideClick(
  ref: RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled)
      return;
    const listener = (event: MouseEvent | TouchEvent) => { // Type 'event' more accurately
      // Ensure ref.current exists before proceeding
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback, enabled]); // `ref` and `callback` are stable due to `useRef` and `useCallback`
}

export function useHorizontalScroll<T extends HTMLDivElement>(
  ref: RefObject<T | null>,
  scrollAmount: number = 300,
) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Memoize scroll handlers to prevent re-renders if passed to child components.
  const scrollLeft = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }, [ref, scrollAmount]);

  const scrollRight = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [ref, scrollAmount]);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      // If the element isn't mounted yet, do nothing.
      return;
    }

    // This function is defined inside the effect, so it doesn't need to be a dependency.
    const checkScrollability = () => {
      const tolerance = 1; // Use a 1px tolerance for floating point inaccuracies
      const hasScrolledToStart = element.scrollLeft <= tolerance;
      const hasScrolledToEnd
        = element.scrollLeft + element.clientWidth >= element.scrollWidth - tolerance;

      setCanScrollLeft(!hasScrolledToStart);
      setCanScrollRight(!hasScrolledToEnd);
    };

    // Initial check
    checkScrollability();

    // Add event listeners
    element.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      element.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [ref, scrollAmount]); // Effect re-runs if the ref or scrollAmount changes

  return { canScrollLeft, canScrollRight, scrollLeft, scrollRight };
};
