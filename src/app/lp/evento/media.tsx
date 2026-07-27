"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Carrossel de fotos (landscape) — p&b, minimalista.                  */
/* Fotos ausentes (404) são removidas automaticamente da rotação.      */
/* ------------------------------------------------------------------ */

type Photo = { src: string; alt: string };

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
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

  if (count === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center border border-dashed border-white/20">
        <p className="max-w-sm px-6 text-center text-sm leading-relaxed text-white/40">
          As fotos do último evento aparecerão aqui.
          <br />
          <span className="text-white/25">
            Adicione os arquivos em <code>public/lp/evento/</code>
          </span>
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
                className="aspect-[16/9] w-full object-cover grayscale"
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(p.src))}
              />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs tabular-nums tracking-widest text-white/40">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <div className="flex gap-6">
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
              className="text-sm tracking-widest text-white/60 transition hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => go(1)}
              className="text-sm tracking-widest text-white/60 transition hover:text-white"
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
/* Foto do palestrante — p&b, com fallback discreto enquanto não há.   */
/* ------------------------------------------------------------------ */

export function SpeakerPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center border border-white/15 bg-white/[0.02]">
        <span className="text-xs uppercase tracking-[0.3em] text-white/30">
          Diego Endrigo
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="aspect-[4/5] w-full object-cover grayscale"
      onError={() => setFailed(true)}
    />
  );
}
