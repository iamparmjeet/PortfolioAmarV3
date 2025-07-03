// components/Marquee.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
};

export function Marquee({
  children,
  speed = 50,
  gap = 16,
  className = "",
}: MarqueeProps) {
  const [singleItemWidth, setSingleItemWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementItemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (measurementItemRef.current) {
      setSingleItemWidth(measurementItemRef.current.offsetWidth);
    }
  }, [children]);

  const animationTravelDistance = singleItemWidth + gap;

  const duration = singleItemWidth > 0 ? animationTravelDistance / speed : 0;

  const repetitions = useMemo(() => {
    if (!containerRef.current || singleItemWidth === 0 || gap < 0) {
      return 3;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const itemsNeededForContainer = Math.ceil(containerWidth / animationTravelDistance);

    return itemsNeededForContainer * 3;
  }, [
    singleItemWidth,
    gap,
    animationTravelDistance,
  ]);

  return (

    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div
        ref={measurementItemRef}
        className="absolute invisible pointer-events-none flex"
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </div>

      <div
        className="flex flex-nowrap w-max will-change-transform motion-reduce:animate-none"
        style={
          {
            "--move-distance": `-${animationTravelDistance}px`,
            "--duration": `${duration}s`,
            "gap": `${gap}px`,
            "animation": `marquee var(--duration) linear infinite`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repetitions }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex-shrink-0" aria-hidden={i !== 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
