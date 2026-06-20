"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeImage } from "@/shared/ui/safe-image";
import { images } from "@/shared/config/images";
import { BRAND, NAV_LINKS } from "@/shared/config/constants";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/">
          <SafeImage
            src={images.logo}
            alt={BRAND.name}
            width={36}
            height={36}
            className="h-9 w-auto"
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: BRAND.color.primary }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/processo-seletivo"
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND.color.primary }}
          >
            Inscreva-se
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-5 transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            style={{ backgroundColor: BRAND.color.primary }}
          />
          <span
            className={`h-0.5 w-5 transition-all ${menuOpen ? "opacity-0" : ""}`}
            style={{ backgroundColor: BRAND.color.primary }}
          />
          <span
            className={`h-0.5 w-5 transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            style={{ backgroundColor: BRAND.color.primary }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium"
                style={{ color: BRAND.color.primary }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/processo-seletivo"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full px-5 py-2.5 text-center text-sm font-medium text-white"
              style={{ backgroundColor: BRAND.color.primary }}
            >
              Inscreva-se
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
