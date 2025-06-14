"use client";
import { IconMenu, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Logo from "@/components/header/logo";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/lib/hooks";

import LetsTalkButton from "../lets-talk-btn";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Works", href: "/works" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScroll();

  return (
    <>
      <header
        className={`container mx-auto bg-black sticky md:flex md:items-center z-50 md:mt-2 px-4 md:px-6 py-2 md:py-4 rounded-3xl top-0  ${scrolled
          ? "bg-black/30 backdrop-blur-md border-b border-gray-800/80"
          : "bg-black"}`}
      >
        <div className="container hidden md:flex items-center justify-between mx-auto">
          <Logo />
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 text-gray-300 text-lg transition-colors">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-colors"
              ${pathname === item.href
                ? "bg-linear-to-r from-orange-600 to-amber-600 text-stone-900"
                : "hover:bg-linear-to-r from-orange-600 to-amber-600 hover:text-stone-900"
              } `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <LetsTalkButton href="#contact" text="Hire me" />
        </div>
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center justify-between">
          <Logo />
          <Button
            type="button"
            variant="orange"
            className="md:hidden rounded-md cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {
              mobileMenuOpen
                ? <IconX className="h-6 w-6" />
                : <IconMenu className="h-6 w-6" />
            }
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden realtive z-20 w-full h-screen">
            <div className="absolutes left-0 right-0 bg-orange-400/15 scroll-auto  backdrop-blur-xl rounded-md w-full p-4 md:hidden ">
              <ul className="flex items-start flex-col space-y-2 mb-6">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-1.5 rounded-md transition-colors text-white " 
                  ${pathname === item.href
                    ? "bg-linear-to-r from-orange-600 to-amber-600"
                    : "hover:bg-linear-to-r from-orange-600 to-amber-600"
                  } `}
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
              <LetsTalkButton href="/contact" text="Lets Talk" />

            </div>
          </div>
        )}
      </header>
    </>
  );
}
