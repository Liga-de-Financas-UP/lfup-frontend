import Link from "next/link";
import { Wordmark } from "@/shared/ui/wordmark";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/shared/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-cream/15">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Wordmark className="text-4xl text-cream" />
            <p className="max-w-xs text-sm leading-relaxed text-cream/50">
              {BRAND.fullName}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-cream/35">
              De alunos, para alunos.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
              Links
            </p>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/60 transition-colors hover:text-cream"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cream/40">
              Social
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cream/60 transition-colors hover:text-cream"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cream/60 transition-colors hover:text-cream"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-cream/15 pt-8">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
