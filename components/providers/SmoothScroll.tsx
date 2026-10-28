"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface LenisContextValue {
  lenis: Lenis | null;
  addScrollListener: (cb: (e: { velocity: number; scroll: number }) => void) => () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  addScrollListener: () => () => {},
});

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const listenersRef = useRef<Set<(e: { velocity: number; scroll: number }) => void>>(new Set());

  useEffect(() => {
    // Respect user prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false,
    });

    setLenisInstance(lenis);

    // Broadcast scroll to specific subscriber components without re-rendering the whole tree
    lenis.on("scroll", (e: { velocity: number; scroll: number }) => {
      ScrollTrigger.update();
      listenersRef.current.forEach((cb) => cb(e));
    });

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      gsap.ticker.lagSmoothing(500, 33); // Restore default lag smoothing on unmount
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  const addScrollListener = (cb: (e: { velocity: number; scroll: number }) => void) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, addScrollListener }}>
      {children}
    </LenisContext.Provider>
  );
}
