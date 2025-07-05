/* eslint-disable react-refresh/only-export-components */
"use client";

import type { ImageProps as NextImageProps } from "next/image";

import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useHorizontalScroll, useOutsideClick } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Types
export type CarouselProps = {
  items: React.ReactNode[];
  initialScroll?: number;
};

export type CardType = {
  src: string;
  title?: string;
  category?: string;
  content?: React.ReactNode;
};

// Context
export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({ onCardClose: () => {}, currentIndex: 0 });

// Helpers
const getBlurUrl = (src: string) => src.replace("hd.webp", "blur.webp");

function calculateCardOffset(): { cardWidth: number; gap: number } {
  if (typeof window === "undefined")
    return { cardWidth: 384, gap: 8 };
  return window.innerWidth < 768
    ? { cardWidth: 230, gap: 4 }
    : { cardWidth: 384, gap: 8 };
}

// Main Carousel
export function Carousel({ items, initialScroll = 0 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const { canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll(carouselRef);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
    }
  }, [initialScroll]);

  const handleCardClose = useCallback((index: number) => {
    if (carouselRef.current) {
      const { cardWidth, gap } = calculateCardOffset();
      carouselRef.current.scrollTo({
        left: (cardWidth + gap) * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, []);

  const contextValue = useMemo(() => ({ onCardClose: handleCardClose, currentIndex }), [handleCardClose, currentIndex]);

  return (
    <CarouselContext value={contextValue}>
      <div className="relative w-full">
        <div className="flex w-full overflow-x-scroll scroll-smooth py-10 [scrollbar-width:none] md:py-20" ref={carouselRef}>
          <div className="absolute right-0 z-[1000] h-auto w-[5%] bg-gradient-to-l" />
          <div className="flex flex-row justify-start gap-4 pl-4 mx-auto max-w-7xl">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 * index, ease: "easeOut" } }}
                key={`card-${index}`}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button type="button" onClick={scrollLeft} disabled={!canScrollLeft} className="z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 dark:bg-neutral-800" aria-label="Scroll carousel left">
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500 dark:text-neutral-300" />
          </button>
          <button type="button" onClick={scrollRight} disabled={!canScrollRight} className="z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 dark:bg-neutral-800" aria-label="Scroll carousel right">
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500 dark:text-neutral-300" />
          </button>
        </div>
      </div>
    </CarouselContext>
  );
}

// Card Component
export function Card({ card, index, layout = false, disablePopup = false }: { card: CardType; index: number; layout?: boolean; disablePopup?: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = use(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (!disablePopup)
      onCardClose(index);
  }, [index, onCardClose, disablePopup]);

  const handleOpen = useCallback(() => {
    if (!disablePopup)
      setOpen(true);
  }, [disablePopup]);

  useEffect(() => {
    if (disablePopup)
      return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        handleClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }
    else {
      document.body.style.overflow = "auto";
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose, disablePopup]);

  useOutsideClick(containerRef, () => open && handleClose(), !disablePopup);

  const wrapperBase = {
    layoutId: layout ? `card-${card.title || `item-${index}`}` : undefined,
    className: "relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900",
  };

  const CardWrapper = disablePopup ? motion.div : motion.button;
  const wrapperProps = disablePopup ? wrapperBase : { ...wrapperBase, type: "button" as const, onClick: handleOpen };

  return (
    <>
      <AnimatePresence>
        {!disablePopup && open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto" aria-modal="true" role="dialog">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" onClick={handleClose} />
            <motion.div ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layoutId={layout ? `card-${card.title || `item-${index}`}` : undefined} className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 md:p-10 dark:bg-neutral-900">
              <button type="button" onClick={handleClose} className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white" aria-label="Close card">
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p layoutId={layout ? `category-${card.title || `item-${index}`}` : undefined} className="text-base font-medium text-black dark:text-white">
                {card.category}
              </motion.p>
              <motion.p layoutId={layout ? `title-${card.title || `item-${index}`}` : undefined} className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white">
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CardWrapper {...wrapperProps}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p layoutId={layout ? `category-${card.title || `item-${index}`}` : undefined} className="text-left font-sans text-sm font-medium text-white md:text-base">
            {card.category}
          </motion.p>
          <motion.p layoutId={layout ? `title-${card.title || `item-${index}`}` : undefined} className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl">
            {card.title}
          </motion.p>
        </div>
        <BlurImage src={card.src} alt={card.title || "Card image"} fill priority={currentIndex === index && open && !disablePopup} className="absolute inset-0 z-10 object-cover" />
      </CardWrapper>
    </>
  );
}

export function BlurImage({ src, alt, className, ...rest }: NextImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt || "Background of a beautiful view"}
      className={cn("transition duration-300", isLoading ? "blur-sm" : "blur-0", className)}
      onLoad={() => setLoading(false)}
      placeholder="blur"
      blurDataURL={getBlurUrl(src.toString())}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      fill={rest.fill !== undefined ? rest.fill : true}
      {...rest}
    />
  );
}
