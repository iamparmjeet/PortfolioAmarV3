"use client";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import React, { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-12 min-w-30 overflow-hidden bg-transparent p-[2px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-orange-600 bg-linear-to-r from-orange-600 to-amber-600 hover:bg-linear-to-l text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export function MovingBorder({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) {
  const pathRef = useRef<SVGRectElement | null>(null);
  const [length, setLength] = useState(0);
  const progress = useMotionValue(0);

  // Measure after layout, before paint
  useLayoutEffect(() => {
    const node = pathRef.current;
    if (!node)
      return;

    // Ensure it's rendered with non-zero size
    const rects = node.getClientRects();
    if (rects.length === 0)
      return;

    try {
      const len = node.getTotalLength();
      setLength(len);
    }
    catch (err) {
      console.warn("SVG still non-rendered for length measurement", err);
    }
  }, []);

  // Animate once we have a valid length
  useAnimationFrame((time) => {
    if (length > 0) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    try {
      return pathRef.current?.getPointAtLength(val).x ?? 0;
    }
    catch {
      return 0;
    }
  });
  const y = useTransform(progress, (val) => {
    try {
      return pathRef.current?.getPointAtLength(val).y ?? 0;
    }
    catch {
      return 0;
    }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      {length > 0 && (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform,
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
