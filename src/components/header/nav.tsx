"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Position = {
  left: number;
  width: number;
  opacity: number;
};

function NavHeader() {
  const pathname = usePathname();
  // console.log("pathname", pathname)
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Set initial active tab position
  useEffect(() => {
    const activeTab = document.querySelector(`a[href="${pathname}"]`);

    if (activeTab) {
      const navbar = activeTab.closest("ul");
      const navbarRect = navbar?.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      setPosition({
        left: tabRect.left - (navbarRect?.left || 0),
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [pathname]);

  return (
    <ul
      className="relative flex w-fit rounded-lg mt-4 bg-lime-400/5 p-1"
      onMouseLeave={() => {
        const activeTab = document.querySelector(`a[href="${pathname}"]`);
        if (activeTab) {
          const navbar = activeTab.closest("ul");
          const navbarRect = navbar?.getBoundingClientRect();
          const tabRect = activeTab.getBoundingClientRect();
          setPosition({
            left: tabRect.left - (navbarRect?.left || 0),
            width: tabRect.width,
            opacity: 1,
          });
        }
      }}
    >
      <Tab href="/" pathname={pathname} setPosition={setPosition}>Home</Tab>
      <Tab href="/about" pathname={pathname} setPosition={setPosition}>About</Tab>
      <Tab href="/pricing" pathname={pathname} setPosition={setPosition}>Pricing</Tab>
      <Tab href="/work" pathname={pathname} setPosition={setPosition}>Work</Tab>
      <Tab href="/contact" pathname={pathname} setPosition={setPosition}>Contact</Tab>

      <Cursor position={position} />
    </ul>
  );
}

function Tab({
  children,
  setPosition,
  href,
  pathname,
}: {
  children: React.ReactNode;
  setPosition: (pos: Position) => void;
  href: string;
  pathname: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      href={href}
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current)
          return;
        const { width } = ref.current.getBoundingClientRect();
        // console.log("Width", width);
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase font-medium mix-blend-difference md:px-5 md:py-3 md:text-base ${
        pathname === href ? "text-lime-400" : "text-lime-600"
      }`}
    >
      {children}
    </Link>
  );
}

type CursorProps = {
  position: Position;
  isActive?: boolean;
};

function Cursor({ position }: CursorProps) {
  return (
    <motion.li
      animate={{ ...position }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="absolute z-0 h-7 rounded-lg bg-lime-600 md:h-12"
    />
  );
}

export default NavHeader;
