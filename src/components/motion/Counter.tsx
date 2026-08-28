"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: string;
}

/** Counts up from zero when scrolled into view (Design A stats strip). */
export function Counter({ value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const target = Number.parseInt(value, 10);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const duration = 1500;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(target * (1 - (1 - t) ** 3)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  if (Number.isNaN(target)) {
    return <span>{value}</span>;
  }

  return <span ref={ref}>{display}</span>;
}
