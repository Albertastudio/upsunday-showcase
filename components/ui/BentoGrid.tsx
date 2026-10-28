"use client";

import React, { useState, useEffect } from "react";
import { useLenis } from "../providers/SmoothScroll";
import { 
  Zap, 
  Layers, 
  Gauge, 
  Sliders, 
  Check, 
  AlertTriangle, 
  MousePointer,
  ShieldCheck
} from "lucide-react";

export default function BentoGrid() {
  const { addScrollListener } = useLenis();
  const [velocity, setVelocity] = useState<number>(0);

  // Subscribe locally to velocity without causing global tree re-renders
  useEffect(() => {
    const unsubscribe = addScrollListener((e) => {
      setVelocity(Math.round(e.velocity * 100) / 100);
    });
    return unsubscribe;
  }, [addScrollListener]);

  // Card 1: Kinetic Typography state
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const typographyLetters = ["K", "I", "N", "E", "T", "I", "C", "S"];

  // Card 3: Interactive micro-task demonstration
  const [edgeActive, setEdgeActive] = useState<boolean>(true);
  const [renderCount, setRenderCount] = useState<number>(1);

  const triggerEdgeBenchmark = () => {
    setEdgeActive((prev) => !prev);
    setRenderCount((c) => c + 1);
  };

  // Card 4: 2px Offset Detection state
  const [offsetMode, setOffsetMode] = useState<"precise" | "shifted">("precise");

  return (
    <section id="capabilities" className="relative py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>CAPABILITIES &amp; ARCHITECTURE</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
              Engineered for absolute fidelity.
            </h2>
          </div>
          <p className="max-w-md text-sm font-sans text-zinc-400 leading-relaxed">
            Every layer of our stack is tuned for maximum perceptual speed.
            No heavy third-party UI bundles, no unbudgeted DOM reflows.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Kinetic Typography (Span 7 cols) */}
          <div className="md:col-span-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700/80 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-700/50 flex items-center justify-center text-zinc-200">
                    <Layers className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-syne text-lg font-bold text-zinc-100">
                      Kinetic Typography Engine
                    </h3>
                    <p className="font-mono text-[11px] text-zinc-400">
                      GSAP SplitText with Sub-pixel Baseline Lock
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                  01 // MOTION
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Hover individual letterforms below to test spring elasticity and real-time transform matrices without triggering layout reflows.
              </p>

              {/* Interactive kinetic letter showcase */}
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-6 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                <div 
                  className="flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300"
                  style={{ letterSpacing: `${letterSpacing}px` }}
                >
                  {typographyLetters.map((char, idx) => {
                    const isHovered = hoveredChar === idx;
                    return (
                      <span
                        key={idx}
                        onMouseEnter={() => setHoveredChar(idx)}
                        onMouseLeave={() => setHoveredChar(null)}
                        className={`font-syne text-4xl sm:text-6xl md:text-7xl font-extrabold select-none cursor-pointer transition-all duration-200 inline-block transform ${
                          isHovered
                            ? "text-white -translate-y-3 scale-110"
                            : "text-zinc-500 hover:text-zinc-200"
                        }`}
                        style={{
                          textShadow: isHovered
                            ? "0 0 24px rgba(52, 211, 153, 0.4)"
                            : "none",
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <MousePointer className="w-3 h-3 text-emerald-400" />
                  <span>Hover to activate character spring physics</span>
                </div>
              </div>
            </div>

            {/* Micro Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span>Tracking Scrub:</span>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-24 accent-emerald-400 cursor-pointer h-1 bg-zinc-800 rounded-lg"
                  aria-label="Typography tracking adjustment"
                />
                <span className="text-zinc-200">+{letterSpacing}px</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 60fps Safe
              </span>
            </div>
          </div>

          {/* Card 2: Smooth Physics & Lenis Velocity (Span 5 cols) */}
          <div className="md:col-span-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700/80 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-700/50 flex items-center justify-center text-zinc-200">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-syne text-lg font-bold text-zinc-100">
                      Lenis Smooth Physics
                    </h3>
                    <p className="font-mono text-[11px] text-zinc-400">
                      Normalized Wheel &amp; Velocity Hooks
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                  02 // PHYSICS
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Lenis synchronizes momentum scrolling directly with GSAP&apos;s ticker loop, eliminating dual-raf tearing and uneven scroll stutter.
              </p>

              {/* Dynamic Velocity Telemetry Gauge */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                  <span>Current Velocity Vector</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.abs(velocity) > 0 ? `${velocity} px/f` : "0.00 (Rest)"}
                  </span>
                </div>

                {/* Visual Momentum Level Bar */}
                <div className="w-full h-3 bg-zinc-850 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-150"
                    style={{
                      width: `${Math.min(100, Math.max(6, Math.abs(velocity) * 8))}%`,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="block text-zinc-400">Damping Factor</span>
                    <span className="text-zinc-200 font-bold">1.2s Exponential</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="block text-zinc-400">Lag Smoothing</span>
                    <span className="text-zinc-200 font-bold">0ms (Strict)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Scroll page to test live velocity</span>
              <span className="text-zinc-200">Touch &amp; Wheel Normalized</span>
            </div>
          </div>

          {/* Card 3: Next.js Edge & Core Web Vitals Targets (Span 5 cols) */}
          <div className="md:col-span-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700/80 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-700/50 flex items-center justify-center text-zinc-200">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-syne text-lg font-bold text-zinc-100">
                      Core Web Vitals Engineering
                    </h3>
                    <p className="font-mono text-[11px] text-zinc-400">
                      Zero Layout Shift Architecture [Technical Demo]
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                  03 // AUDIT
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                App Router with edge prerendering. Click to trigger live micro-task state transitions without blocking the main event loop.
              </p>

              {/* Core Web Vitals Standards Box */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs text-zinc-300">
                      Target Audit Standards
                    </span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    Strict Budget
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">LCP</span>
                    <span className="text-emerald-400 font-semibold text-xs">&lt; 1.0s</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">CLS</span>
                    <span className="text-emerald-400 font-semibold text-xs">0.000</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">INP</span>
                    <span className="text-emerald-400 font-semibold text-xs">&lt; 50ms</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">FCP</span>
                    <span className="text-emerald-400 font-semibold text-xs">&lt; 0.8s</span>
                  </div>
                </div>

                {/* Interactive State Toggle */}
                <button
                  id="edge-benchmark-btn"
                  onClick={triggerEdgeBenchmark}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 text-xs font-mono text-zinc-200 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${edgeActive ? "bg-emerald-400" : "bg-cyan-400"}`} />
                    <span>State Profiler (Toggle #{renderCount})</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    Non-blocking Loop
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Layout Shift: 0.00</span>
              <span className="text-emerald-400">SSR + Edge Optimized</span>
            </div>
          </div>

          {/* Card 4: Sub-pixel Craft / 2px Offset Detection (Span 7 cols) */}
          <div className="md:col-span-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700/80 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-700/50 flex items-center justify-center text-zinc-200">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-syne text-lg font-bold text-zinc-100">
                      Sub-Pixel Craft &amp; Offset Detection
                    </h3>
                    <p className="font-mono text-[11px] text-zinc-400">
                      &ldquo;Fast and 2px off is also a bug.&rdquo;
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                  04 // PRECISION
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                Toggle below to inspect why 2px alignment errors destroy perceptual elegance. We maintain surgical sub-pixel grid bounds across every breakpoint.
              </p>

              {/* Interactive Visual Comparison Container */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400">Inspect State:</span>
                    <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
                      <button
                        onClick={() => setOffsetMode("precise")}
                        className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                          offsetMode === "precise"
                            ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        0.0px Precision
                      </button>
                      <button
                        onClick={() => setOffsetMode("shifted")}
                        className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                          offsetMode === "shifted"
                            ? "bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        +2.0px Misaligned Bug
                      </button>
                    </div>
                  </div>

                  {offsetMode === "shifted" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3" /> 2px Shift Bug
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Check className="w-3 h-3" /> Exact 0px Lock
                    </span>
                  )}
                </div>

                {/* Sub-pixel Visual Grid Preview */}
                <div className="relative h-28 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center p-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
                  
                  {/* Baseline Guide Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-zinc-600/60 z-0" />
                  <span className="absolute right-2 top-2 font-mono text-[9px] text-zinc-400">
                    BASELINE REFERENCE AXIS
                  </span>

                  {/* Target Alignment Elements */}
                  <div className="relative z-10 flex items-center gap-4">
                    {/* Reference Box */}
                    <div className="w-20 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono text-[10px] text-zinc-300">
                      Anchor [0px]
                    </div>

                    {/* Test Box with controlled sub-pixel offset */}
                    <div
                      className={`w-28 h-12 rounded-lg flex items-center justify-center font-mono text-[10px] transition-transform duration-200 ${
                        offsetMode === "shifted"
                          ? "bg-rose-950/40 border border-rose-500/60 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                          : "bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                      }`}
                      style={{
                        transform: `translateY(${offsetMode === "shifted" ? "2px" : "0px"}) translateX(${offsetMode === "shifted" ? "2px" : "0px"})`,
                      }}
                    >
                      {offsetMode === "shifted" ? "+2.0px OFF [BUG]" : "PERFECT [0.0px]"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Boutique Engineering Standard</span>
              <span className="text-zinc-200">Strict CSS Grid &amp; Baseline Lock</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
