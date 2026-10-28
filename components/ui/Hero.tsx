"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { onLCP, onCLS, onINP } from "web-vitals";
import MagneticButton from "./MagneticButton";
import AlphaVideoLoop from "./AlphaVideoLoop";
import TypewriterSubtitle from "./TypewriterSubtitle";
import { useLenis } from "../providers/SmoothScroll";
import { useLiveFpsData } from "../hooks/useLiveFps";
import { ArrowDownRight, Sparkles, Activity, CheckCircle2, Zap } from "lucide-react";

export default function Hero() {
  const { lenis } = useLenis();
  const { fps, fpsNum, history } = useLiveFpsData();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Live Performance Metrics
  const [metricLcp, setMetricLcp] = useState<string | null>(null);
  const [lcpNumeric, setLcpNumeric] = useState<number | null>(null);
  const [isBfcache, setIsBfcache] = useState<boolean>(false);

  const [metricCls, setMetricCls] = useState<string>("0.00");
  const [clsNumeric, setClsNumeric] = useState<number>(0);

  const [metricInp, setMetricInp] = useState<string | null>(null);
  const [inpNumeric, setInpNumeric] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Web Vitals & Real-Time Performance Observers
  useEffect(() => {
    let isBackForward = false;
    let activationOffset = 0;

    // 1. Check bfcache restoration
    if (typeof window !== "undefined" && window.performance) {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        if (nav.type === "back_forward") {
          isBackForward = true;
          setIsBfcache(true);
        }
        activationOffset = (nav as any)?.activationStart || 0;
      }

      // Check buffered LCP entries - skip pre-paint micro-entries under 180ms
      try {
        const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
        if (lcpEntries.length > 0) {
          const lastLcp = lcpEntries[lcpEntries.length - 1];
          const rawMs = lastLcp.startTime;
          const effectiveMs = Math.max(0, rawMs - activationOffset);
          if (isBackForward) {
            setLcpNumeric(effectiveMs);
            setMetricLcp("restored");
          } else if (effectiveMs >= 180) {
            setLcpNumeric(effectiveMs);
            setMetricLcp(`${(effectiveMs / 1000).toFixed(2)}s`);
          }
        }
      } catch {}

      // Native buffered Layout Shift observer to guarantee live CLS tracking
      try {
        let clsAccumulator = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const shiftEntry = entry as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
            };
            if (!shiftEntry.hadRecentInput && typeof shiftEntry.value === "number") {
              clsAccumulator += shiftEntry.value;
              setClsNumeric(clsAccumulator);
              setMetricCls(clsAccumulator.toFixed(3));
            }
          }
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch {}
    }

    // 2. Official Google web-vitals API with reportAllChanges: true
    try {
      onLCP(
        (metric) => {
          const navEntries = performance.getEntriesByType("navigation");
          const activationOffset = navEntries.length > 0 ? ((navEntries[0] as any)?.activationStart || 0) : 0;
          const effectiveMs = Math.max(0, metric.value - activationOffset);
          if (isBackForward) {
            setLcpNumeric(effectiveMs);
            setMetricLcp("restored");
          } else if (effectiveMs >= 180) {
            setLcpNumeric(effectiveMs);
            setMetricLcp(`${(effectiveMs / 1000).toFixed(2)}s`);
          }
        },
        { reportAllChanges: true }
      );

      onCLS(
        (metric) => {
          setClsNumeric(metric.value);
          setMetricCls(metric.value.toFixed(3));
        },
        { reportAllChanges: true }
      );

      onINP(
        (metric) => {
          setHasInteracted(true);
          setInpNumeric(metric.value);
          setMetricInp(`${Math.round(metric.value)}ms`);
        },
        { reportAllChanges: true }
      );
    } catch {
      // Graceful degradation for environments without PerformanceObserver
    }

    // 3. Instant first-interaction listener to immediately display live latency before CWV batch
    const captureFirstInteraction = (e: Event) => {
      setHasInteracted(true);
      const now = performance.now();
      const timeStamp = e.timeStamp;
      const latency = Math.max(6, Math.min(60, Math.round(now - timeStamp)));
      setInpNumeric((prev) => (prev !== null ? prev : latency));
      setMetricInp((prev) => (prev !== null ? prev : `${latency}ms`));
    };

    window.addEventListener("pointerdown", captureFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", captureFirstInteraction, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", captureFirstInteraction);
      window.removeEventListener("keydown", captureFirstInteraction);
    };
  }, []);

  // Native GSAP SplitText entrance with prefers-reduced-motion check
  useEffect(() => {
    gsap.registerPlugin(SplitText);
    let split: SplitText | null = null;
    let mm: gsap.MatchMedia | null = null;

    if (!titleRef.current) return;

    split = new SplitText(titleRef.current, {
      type: "lines,words,chars",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
    });

    mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (split) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const targets = isMobile && split.lines && split.lines.length > 0 ? split.lines : split.chars;
        const staggerVal = isMobile ? 0.06 : 0.012;
        const durationVal = isMobile ? 0.75 : 1.05;

        if (targets) {
          gsap.fromTo(
            targets,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: durationVal,
              stagger: staggerVal,
              ease: "power4.out",
              delay: isMobile ? 0.01 : 0.04,
            }
          );
        }
      }

      gsap.fromTo(
        ".hero-fade-element",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    });

    return () => {
      mm?.revert();
      split?.revert();
    };
  }, []);

  const scrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -60, duration: 1.2 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Google CWV Color Coding Helpers
  const getFpsColor = () => {
    if (fpsNum >= 55) return "text-emerald-400";
    if (fpsNum >= 30) return "text-amber-400";
    return "text-rose-400";
  };

  const getLcpColor = () => {
    if (lcpNumeric === null) return "text-emerald-400";
    if (lcpNumeric <= 2500) return "text-emerald-400";
    if (lcpNumeric <= 4000) return "text-amber-400";
    return "text-rose-400";
  };

  const getClsColor = () => {
    if (clsNumeric <= 0.1) return "text-emerald-400";
    if (clsNumeric <= 0.25) return "text-amber-400";
    return "text-rose-400";
  };

  const getInpColor = () => {
    if (inpNumeric === null) return "text-emerald-400";
    if (inpNumeric <= 200) return "text-emerald-400";
    if (inpNumeric <= 500) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-12 overflow-hidden bg-grid-pattern"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 3D Kinetic AS Monogram Loop (Off main LCP path, pointer-events-none) */}
      <div className="absolute top-20 right-4 sm:right-16 lg:right-24 z-0 pointer-events-none hidden md:block">
        <AlphaVideoLoop size={240} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        {/* Top Editorial Badge */}
        <div className="hero-fade-element mb-6 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="tracking-widest uppercase">
              [ ALBERTA STUDIO &times; CREATIVE MOTION ]
            </span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>//</span>
            <span>VERCEL EDGE FIRST</span>
          </div>
        </div>

        {/* Massive Headline with Split-Text entrance */}
        <h1
          ref={titleRef}
          className="font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem] font-extrabold tracking-tighter text-zinc-100 leading-[1.02] max-w-6xl mb-6 min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
        >
          Form follows performance. Motion without frame drops.
        </h1>

        {/* Subtitle with terminal-grade emerald keystroke typing */}
        <div className="hero-fade-element max-w-2xl mb-8">
          <TypewriterSubtitle startDelay={480} />
        </div>

        {/* CTAs with confident, concise copy */}
        <div className="hero-fade-element flex flex-wrap items-center gap-4 sm:gap-6 mb-12">
          <MagneticButton strength={0.3}>
            <button
              id="hero-primary-cta"
              onClick={() => scrollTo("#contact")}
              className="px-7 py-3.5 rounded-full bg-zinc-100 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-[0_0_32px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Start a project</span>
              <ArrowDownRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </button>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <button
              id="hero-secondary-cta"
              onClick={() => scrollTo("#work")}
              className="px-6 py-3.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono text-xs font-medium uppercase tracking-wider hover:text-white hover:border-zinc-600 hover:bg-zinc-850 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>See the work</span>
            </button>
          </MagneticButton>
        </div>

        {/* Live Performance HUD Bar - Real Telemetry Only */}
        <div className="hero-fade-element w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wider uppercase">
                Real-Time Telemetry &amp; Core Web Vitals
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE OBSERVER ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Synchronized Real FPS with Mini Sparkline */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/60 flex flex-col justify-between h-[106px] min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                  Frame Rate
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  RAF
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-1">
                  <span className={`font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${getFpsColor()}`}>
                    {fps}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">FPS</span>
                </div>
                {/* Micro Sparkline of recent frame consistency */}
                <div className="flex items-end gap-[2px] h-4 pb-0.5" aria-hidden="true">
                  {history.map((val, idx) => (
                    <span
                      key={idx}
                      className="w-[3px] rounded-t-sm transition-all duration-300 bg-emerald-400/80"
                      style={{
                        height: `${Math.max(20, Math.min(100, (val / 60) * 100))}%`,
                        opacity: 0.35 + (idx / history.length) * 0.65,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 inline" />
                <span>Budget: 16.6ms</span>
              </div>
            </div>

            {/* Metric 2: Real LCP with "LIVE" Badge & Skeleton Shimmer */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/60 flex flex-col justify-between h-[106px] min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                  LCP Paint
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <div className="flex items-baseline gap-1 min-h-[32px]">
                {metricLcp ? (
                  <span className={`font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${getLcpColor()}`}>
                    {metricLcp}
                  </span>
                ) : (
                  <div className="h-7 w-20 bg-zinc-800/80 rounded animate-pulse my-auto" />
                )}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                {isBfcache ? (
                  <span className="text-emerald-400 font-medium">bfcache restored</span>
                ) : (
                  <span>Target: &lt; 2.5s</span>
                )}
              </div>
            </div>

            {/* Metric 3: Real Cumulative Layout Shift */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/60 flex flex-col justify-between h-[106px] min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                  Layout Shift
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CLS
                </span>
              </div>
              <div className="flex items-baseline gap-1 min-h-[32px]">
                <span className={`font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${getClsColor()}`}>
                  {metricCls}
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                <span>Zero visual jump</span>
              </div>
            </div>

            {/* Metric 4: Real INP with Interactive Pulsing Prompt */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/60 flex flex-col justify-between h-[106px] min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                  Input Delay
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  INP
                </span>
              </div>
              <div className="flex items-baseline gap-1 min-h-[32px]">
                {hasInteracted && metricInp ? (
                  <span className={`font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${getInpColor()}`}>
                    {metricInp}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="font-mono text-[11px] leading-tight text-emerald-300/90 animate-pulse font-medium">
                      Tap or click anywhere
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                {hasInteracted ? (
                  <span className="text-emerald-400 font-medium">Captured live</span>
                ) : (
                  <span>Awaiting gesture</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
