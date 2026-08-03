"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "@/shared/ui/wordmark";
import { NAV_LINKS } from "@/shared/config/constants";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cream/15 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" aria-label="LFUP — início">
          <Wordmark className="text-3xl text-cream" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-cream/60 transition hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/processo-seletivo"
            className="bg-cream px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-cream/80"
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
            className={`h-0.5 w-5 bg-cream transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-5 bg-cream transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-5 bg-cream transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-cream/15 bg-ink px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-cream/70"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/processo-seletivo"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-cream px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              Inscreva-se
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
