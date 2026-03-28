"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type LazyLoadWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function LazyLoadWrapper({
  children,
  className,
}: LazyLoadWrapperProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "200px",
      },
    );
    observer.observe(ref.current);
    return () => observer.disconnect    ()
  }, [])

  return (
      <div ref={ref} className={className}>
        {isInView
          ? children
          : (
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-[9/16] w-full bg-neutral-800 animate-pulse rounded-xl" />
                <div className="p-4 bg-neutral-900 space-y-2">
                  <div className="h-5 w-3/4 bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-neutral-700 rounded animate-pulse mt-2" />
                </div>
              </div>
            )}
      </div>
    );
  }
