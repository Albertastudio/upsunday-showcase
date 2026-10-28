"use client";

import React, { useState, useEffect } from "react";
import MagneticButton from "./MagneticButton";
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  Mail, 
  Clock, 
  Terminal 
} from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [times, setTimes] = useState({
    calgary: "--:--:--",
    vancouver: "--:--:--",
    zurich: "--:--:--",
    utc: "--:--:--",
  });

  // Live timezone clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimes({
        calgary: now.toLocaleTimeString("en-US", {
          timeZone: "America/Edmonton",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        vancouver: now.toLocaleTimeString("en-US", {
          timeZone: "America/Vancouver",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        zurich: now.toLocaleTimeString("en-US", {
          timeZone: "Europe/Zurich",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        utc: now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@albertastudio.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer id="contact" className="relative bg-zinc-950 pt-28 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Section */}
        <div className="mb-24 pb-20 border-b border-zinc-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>CONTACT // START A CONVERSATION</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-100 max-w-5xl leading-[1.02] mb-10">
            Ready to build something unforgettable?
          </h2>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <MagneticButton strength={0.3}>
              <a
                href="mailto:hello@albertastudio.dev"
                className="px-8 py-4 rounded-full bg-zinc-100 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:shadow-[0_0_36px_rgba(255,255,255,0.35)] transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>hello@albertastudio.dev</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </MagneticButton>

            <button
              onClick={copyEmail}
              className="px-5 py-4 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs transition-colors flex items-center gap-2 cursor-pointer"
              aria-label="Copy Email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio Operations / Timezone Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16 pb-16 border-b border-zinc-800/60 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>CALGARY [MT]</span>
            </div>
            <span className="text-lg font-bold text-zinc-100">
              {times.calgary}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-1">Creative HQ</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>VANCOUVER [PT]</span>
            </div>
            <span className="text-lg font-bold text-zinc-100">
              {times.vancouver}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-1">West Coast Time</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>ZURICH [CET]</span>
            </div>
            <span className="text-lg font-bold text-zinc-100">
              {times.zurich}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-1">Central Europe</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>UTC</span>
            </div>
            <span className="text-lg font-bold text-zinc-100">
              {times.utc}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-1">Universal Time</span>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-syne font-bold text-zinc-200">ALBERTA STUDIO</span>
            <span>//</span>
            <span>FORM FOLLOWS PERFORMANCE</span>
          </div>

          {/* Authentic Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Albertastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors flex items-center gap-1 group"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-200" />
            </a>
            <a
              href="https://www.linkedin.com/in/yuliia-mytrofanova-70837529a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors flex items-center gap-1 group"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-200" />
            </a>
            <a
              href="mailto:hello@albertastudio.dev"
              className="hover:text-zinc-200 transition-colors flex items-center gap-1 group"
            >
              <span>Email</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-200" />
            </a>
          </div>

          <div className="text-[11px] text-zinc-400">
            <span>&copy; 2026 Alberta Studio. Crafted in Calgary, AB.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
