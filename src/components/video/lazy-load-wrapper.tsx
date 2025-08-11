"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type LazyLoadWrapperProps = {
  children: ReactNode;
  className?: string;
  placeholderHeight?: string; // e.g., '500px' or use aspect-ratio
};

export default function LazyLoadWrapper({
  children,
  className,
  placeholderHeight = "400px", // A sensible default
}: LazyLoadWrapperProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure we don't run this on the server
    if (typeof window === "undefined" || !ref.current)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state to true when the element is intersecting
        if (entry.isIntersecting) {
          setIsInView(true);
          // Stop observing once it's in view
          observer.unobserve(entry.target);
        }
      },
      {
        // Optional: Load content 200px before it enters the viewport
        // for a smoother experience.
        rootMargin: "200px",
      },
    );

    observer.observe(ref.current);

    // Cleanup function to disconnect the observer
    return () => {
      if (observer && ref.current) {
        observer.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      ref={ref}
      className={className}
      // Set a minimum height to prevent layout shift while the component is not in view
      style={!isInView ? { minHeight: placeholderHeight } : {}}
    >
      {isInView ? children : null}
    </div>
  );
}
