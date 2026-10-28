"use client";

import React, { useState, useEffect } from "react";
import MagneticButton from "./MagneticButton";
import { useLenis } from "../providers/SmoothScroll";
import { useLiveFps } from "../hooks/useLiveFps";
import { ArrowUpRight, Cpu } from "lucide-react";

export default function Navbar() {
  const { lenis } = useLenis();
  const liveFps = useLiveFps();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -60, duration: 1.2 });
    } else {
      const el = document.querySelector(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl shadow-black/50 py-3"
          : "bg-zinc-950/40 backdrop-blur-sm border-b border-zinc-900/60 py-4.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Studio Monogram / Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center p-1 group-hover:border-emerald-500/60 transition-colors shadow-inner">
              <img src="/brand/as-monogram.svg" alt="AS" width={24} height={24} className="w-full h-full object-contain" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-bold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                ALBERTA STUDIO
              </span>
              <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Calgary, AB &times; MT
              </span>
            </div>
          </a>
        </div>

        {/* Center: Live Availability Badge & Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Available for Q4 2026 / Q1 2027</span>
          </div>

          <nav className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <button
              onClick={() => scrollToSection("#capabilities")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection("#work")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Selected Work
            </button>
            <button
              onClick={() => scrollToSection("#manifesto")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Philosophy
            </button>
          </nav>
        </div>

        {/* Right: CTA & Shared Live FPS */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 font-mono text-[11px] text-zinc-400">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>{liveFps !== "—" ? `${liveFps} FPS` : "FPS —"}</span>
          </div>

          <MagneticButton strength={0.25}>
            <button
              id="nav-contact-cta"
              onClick={() => scrollToSection("#contact")}
              className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] transition-all cursor-pointer group"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}
