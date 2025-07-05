import type { RefObject } from "react";

import { useEffect, useState } from "react";

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

export function useOutsideClick(ref: RefObject<HTMLDivElement | null>,
  // Improvement: Make callback type more specific than generic 'Function'
  callback: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
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
  }, [ref, callback]); // `ref` and `callback` are stable due to `useRef` and `useCallback`
}
