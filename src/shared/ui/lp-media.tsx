"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Mídia compartilhada das LPs de evento (fundo preto, p&b).           */
/* Fotos ausentes (404) são removidas automaticamente da rotação.      */
/* ------------------------------------------------------------------ */

type Photo = { src: string; alt: string };
type Tone = "dark" | "light";

export function PhotoCarousel({
  photos,
  emptyHint,
  tone = "dark",
  grayscale = true,
}: {
  photos: Photo[];
  /** Pasta onde colocar os arquivos, exibida no placeholder (ex.: "public/lp/evento/") */
  emptyHint?: string;
  /** "dark" para LPs de fundo preto, "light" para fundo claro */
  tone?: Tone;
  grayscale?: boolean;
}) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const valid = photos.filter((p) => !broken.has(p.src));
  const count = valid.length;

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [paused, count]);

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [index, count]);

  const muted = tone === "dark" ? "text-white/40" : "text-black/40";
  const faint = tone === "dark" ? "text-white/25" : "text-black/30";
  const arrow =
    tone === "dark"
      ? "text-white/60 transition hover:text-white"
      : "text-black/50 transition hover:text-black";

  if (count === 0) {
    return (
      <div
        className={`flex aspect-[16/9] w-full items-center justify-center border border-dashed ${
          tone === "dark" ? "border-white/20" : "border-black/20"
        }`}
      >
        <p className={`max-w-sm px-6 text-center text-sm leading-relaxed ${muted}`}>
          As fotos aparecerão aqui.
          {emptyHint && (
            <>
              <br />
              <span className={faint}>
                Adicione os arquivos em <code>{emptyHint}</code>
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {valid.map((p) => (
            <div key={p.src} className="w-full shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className={`aspect-[16/9] w-full object-cover ${grayscale ? "grayscale" : ""}`}
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(p.src))}
              />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs tabular-nums tracking-widest ${muted}`}>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <div className="flex gap-6">
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
              className={`text-sm tracking-widest ${arrow}`}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => go(1)}
              className={`text-sm tracking-widest ${arrow}`}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carrossel de retratos (4:5) em rolagem automática contínua.         */
/* Pausa no hover; fotos ausentes (404) saem da rotação sozinhas.      */
/* ------------------------------------------------------------------ */

export function PortraitMarquee({
  photos,
  emptyHint,
  tone = "dark",
  grayscale = false,
}: {
  photos: Photo[];
  emptyHint?: string;
  tone?: Tone;
  grayscale?: boolean;
}) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const valid = photos.filter((p) => !broken.has(p.src));

  if (valid.length === 0) {
    return (
      <div
        className={`flex aspect-[4/5] w-full max-w-xs items-center justify-center border border-dashed ${
          tone === "dark" ? "border-white/20" : "border-black/20"
        }`}
      >
        <p
          className={`max-w-sm px-6 text-center text-sm leading-relaxed ${
            tone === "dark" ? "text-white/40" : "text-black/40"
          }`}
        >
          As fotos aparecerão aqui.
          {emptyHint && (
            <>
              <br />
              <span className={tone === "dark" ? "text-white/25" : "text-black/30"}>
                Adicione os arquivos em <code>{emptyHint}</code>
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  // Duplica a sequência para o loop ser contínuo (a animação anda -50%).
  const loop = [...valid, ...valid];

  return (
    <div className="lp-marquee overflow-hidden">
      <style>{`
        @keyframes lp-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .lp-marquee-track {
          animation: lp-marquee-scroll ${valid.length * 9}s linear infinite;
        }
        .lp-marquee:hover .lp-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-marquee-track { animation: none; }
        }
      `}</style>
      <div className="lp-marquee-track flex w-max gap-4 md:gap-6">
        {loop.map((p, i) => (
          <div key={`${p.src}-${i}`} className="w-56 shrink-0 md:w-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={i < valid.length ? p.alt : ""}
              aria-hidden={i >= valid.length}
              className={`aspect-[4/5] w-full object-cover ${grayscale ? "grayscale" : ""}`}
              loading="lazy"
              onError={() => setBroken((prev) => new Set(prev).add(p.src))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Foto do palestrante, com fallback discreto (nome) enquanto não há.  */
/* ------------------------------------------------------------------ */

export function SpeakerPhoto({
  src,
  alt,
  tone = "dark",
  grayscale = true,
}: {
  src: string;
  alt: string;
  tone?: Tone;
  grayscale?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex aspect-[4/5] w-full items-center justify-center border ${
          tone === "dark"
            ? "border-white/15 bg-white/[0.02]"
            : "border-black/15 bg-black/[0.03]"
        }`}
      >
        <span
          className={`px-4 text-center text-xs uppercase tracking-[0.3em] ${
            tone === "dark" ? "text-white/30" : "text-black/35"
          }`}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`aspect-[4/5] w-full object-cover ${grayscale ? "grayscale" : ""}`}
      onError={() => setFailed(true)}
    />
  );
}
