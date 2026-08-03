import { cn } from "@/lib/utils";

/**
 * Logo-wordmark da marca: "lfup." em Gloucester Extra Condensed.
 * Tamanho e cor são controlados por className (ex.: "text-3xl text-cream").
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-display lowercase leading-none", className)}
      style={{ letterSpacing: "-0.02em" }}
    >
      lfup.
    </span>
  );
}
