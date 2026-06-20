"use client";

import { useEffect, useRef } from "react";
import type { ExamEventType } from "@/entities/exam/model/types";

type EventSender = (
  type: ExamEventType,
  details?: Record<string, unknown>,
) => void;

interface Options {
  enabled: boolean;
  send: EventSender;
  onViolation: () => void;
}

const FOCUS_COOLDOWN_MS = 500;

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

function clarityEvent(type: string, details?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.clarity !== "function") return;
  try {
    window.clarity("event", `exam:${type}`);
    if (details) {
      for (const [k, v] of Object.entries(details)) {
        if (typeof v === "string" || typeof v === "number") {
          window.clarity("set", `exam:${type}:${k}`, String(v));
        }
      }
    }
  } catch {}
}

/**
 * Wires up cheat-detection listeners. Fires exam events to the backend and
 * calls onViolation once the server reports that the attempt has been
 * terminated due to focus violations.
 */
export function useAntiCheat({ enabled, send, onViolation }: Options) {
  const lastFocusLossAt = useRef(0);
  const terminatedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const fire = (type: ExamEventType, details?: Record<string, unknown>) => {
      if (terminatedRef.current) return;
      send(type, details);
      clarityEvent(type, details);
    };

    // On touch devices, window.blur fires spuriously when the soft keyboard
    // opens (iOS Safari / most Android browsers). The document stays visible.
    // So on mobile we only treat visibilitychange→hidden as a violation and
    // skip blur-based detection. On desktop we keep both signals.
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const now = Date.now();
        if (now - lastFocusLossAt.current < FOCUS_COOLDOWN_MS) return;
        lastFocusLossAt.current = now;
        fire("tab_hidden");
      } else if (document.visibilityState === "visible") {
        fire("tab_visible");
      }
    };

    const onBlur = () => {
      if (isTouchDevice) return;
      const now = Date.now();
      if (now - lastFocusLossAt.current < FOCUS_COOLDOWN_MS) return;
      lastFocusLossAt.current = now;
      fire("focus_lost");
    };

    const onFocus = () => {
      if (isTouchDevice) return;
      fire("focus_return");
    };

    const onPaste = (e: ClipboardEvent) => {
      const len = e.clipboardData?.getData("text")?.length ?? 0;
      fire("paste", { length: len });
    };

    const onCopy = () => {
      fire("copy");
    };

    const onContextMenu = (e: MouseEvent) => {
      fire("contextmenu");
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      const isDevtoolsBind =
        key === "f12" ||
        (ctrl && shift && (key === "i" || key === "j" || key === "c")) ||
        (ctrl && (key === "u" || key === "s" || key === "p"));

      if (isDevtoolsBind) {
        e.preventDefault();
        e.stopPropagation();
        fire("devtools_keybind", { key, ctrl, shift });
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (terminatedRef.current) return;
      e.preventDefault();
      e.returnValue =
        "Se sair da prova agora, o tempo continua correndo e a tentativa pode ser encerrada.";
    };

    // Devtools heuristic — the diff between inner and outer window size is a
    // strong signal that devtools is open (docked side/bottom). Not perfect
    // (misses detached devtools), but good enough to log.
    let devtoolsOpenReported = false;
    const checkDevtools = () => {
      if (typeof window === "undefined") return;
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      const threshold = 160;
      const looksOpen = wDiff > threshold || hDiff > threshold;
      if (looksOpen && !devtoolsOpenReported) {
        devtoolsOpenReported = true;
        fire("devtools_detected", { wDiff, hDiff });
      } else if (!looksOpen) {
        devtoolsOpenReported = false;
      }
    };

    const onResize = () => {
      fire("resize", {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
      checkDevtools();
    };

    const onFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      fire(inFullscreen ? "fullscreen_enter" : "fullscreen_exit");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("paste", onPaste);
    window.addEventListener("copy", onCopy);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("beforeunload", onBeforeUnload);

    checkDevtools();
    const devtoolsInterval = window.setInterval(checkDevtools, 2000);
    const heartbeatInterval = window.setInterval(() => {
      if (!terminatedRef.current) fire("heartbeat");
    }, 30_000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("copy", onCopy);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.clearInterval(devtoolsInterval);
      window.clearInterval(heartbeatInterval);
    };
  }, [enabled, send]);

  return {
    markTerminated() {
      terminatedRef.current = true;
      onViolation();
    },
  };
}

export { clarityEvent };
