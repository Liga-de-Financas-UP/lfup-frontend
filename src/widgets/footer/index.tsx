import Link from "next/link";
import { SafeImage } from "@/shared/ui/safe-image";
import { images } from "@/shared/config/images";
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "@/shared/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <SafeImage
              src={images.logoBull}
              alt={BRAND.name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain opacity-70"
              unoptimized
            />
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              {BRAND.fullName}
            </p>
            <p className="text-xs text-gray-300">
              Feito por alunos, para todos!
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: BRAND.color.primary }}
            >
              Links
            </p>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: BRAND.color.primary }}
            >
              Social
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <p className="text-center text-xs text-gray-300">
            &copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
