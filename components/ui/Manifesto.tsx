"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Clock, Crosshair, Sparkles } from "lucide-react";

export default function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const manifestoText =
    "We do not compromise. High fidelity should never mean high latency. Every frame is budgeted. Every pixel is intentional.";

  const words = manifestoText.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let mm: gsap.MatchMedia | null = null;

    const ctx = gsap.context(() => {
      const wordElements = containerRef.current?.querySelectorAll(".manifesto-word");
      if (!wordElements || wordElements.length === 0) return;

      mm = gsap.matchMedia();

      // Scrub animation only when user prefers motion
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          wordElements,
          {
            color: "#71717a", // zinc-500 (passes 4.5:1 contrast)
          },
          {
            color: "#ffffff", // bright white
            stagger: 0.08,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: 1.2,
            },
          }
        );
      });

      // Immediate full visibility when reduced motion is preferred
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wordElements, {
          opacity: 1,
          color: "#f4f4f5",
        });
      });
    }, containerRef);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative py-36 bg-zinc-950 overflow-hidden border-t border-zinc-900"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-widest">
              THE PHILOSOPHY // NO COMPROMISE
            </span>
          </div>
        </div>

        {/* Scroll-driven Opacity/Color Scrub Manifesto Headline */}
        <div className="max-w-5xl mx-auto text-center mb-24">
          <p
            ref={textRef}
            className="font-syne text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] select-none text-zinc-400"
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="manifesto-word inline-block mr-2.5 sm:mr-3.5 transition-colors duration-200"
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Engineering Dogma Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-emerald-400 mb-6">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-syne text-xl font-bold text-zinc-100 mb-2">
              16.6ms Frame Budget
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed mb-4">
              Animation is poetry, but frame drops are bugs. If an interaction does not maintain steady 60fps on consumer silicon, we optimize the execution graph until it does.
            </p>
            <span className="font-mono text-xs text-emerald-400">
              Steady 60fps Target
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-cyan-400 mb-6">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="font-syne text-xl font-bold text-zinc-100 mb-2">
              CLS = 0.00 Non-Negotiable
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed mb-4">
              Zero layout shifts. Every font subset, video shell, and dynamic image has hard-coded intrinsic aspect ratios to prevent content jumping before hydration.
            </p>
            <span className="font-mono text-xs text-cyan-400">
              Zero Layout Shift
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-violet-400 mb-6">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-syne text-xl font-bold text-zinc-100 mb-2">
              Vercel Edge &amp; Sub-second LCP
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed mb-4">
              Rendered on edge infrastructure with instant time-to-first-byte (TTFB). We treat performance not as a post-launch audit, but as our primary artistic medium.
            </p>
            <span className="font-mono text-xs text-violet-400">
              Edge Pre-rendering
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
