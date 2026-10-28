"use client";

import React, { useState } from "react";
import MagneticButton from "./MagneticButton";
import { 
  ArrowUpRight, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Maximize2 
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  specs: {
    runtime: string;
    renderTarget: string;
    layoutStability: string;
    threadIsolation: string;
  };
  palette: {
    gradient: string;
    border: string;
    accent: string;
  };
  details: string[];
}

const projects: Project[] = [
  {
    id: "kromatik-labs",
    title: "KROMATIK LABS",
    client: "Concept Prototype // Spatial Audio",
    category: "Algorithmic Synthesizer",
    year: "2026",
    description: "An algorithmic synthesizer and browser-based spatial audio interface. Engineered with zero DOM thrashing and custom audio-thread web workers.",
    tags: ["Next.js App Router", "WebGL 2.0", "Spatial Audio", "GSAP Kinetics"],
    specs: {
      runtime: "Web Audio Worklet",
      renderTarget: "Canvas WebGL",
      layoutStability: "CLS = 0.00",
      threadIsolation: "Worker Isolated",
    },
    palette: {
      gradient: "from-emerald-950/50 via-zinc-900 to-zinc-950",
      border: "hover:border-emerald-500/50",
      accent: "text-emerald-400",
    },
    details: [
      "Custom audio worklet buffer isolation preventing main thread jank",
      "Dynamic canvas wave analyzer rendering 60fps on mobile Safari",
      "Strict CSS sub-pixel lock avoiding 1px rounding discrepancies",
    ],
  },
  {
    id: "aether-archive",
    title: "AETHER ARCHIVE",
    client: "Concept Study // Brutalist Architecture",
    category: "Digital Monograph & Catalog",
    year: "2026",
    description: "Minimalist editorial platform showcasing high-resolution brutalist architecture. Built with Lenis inertial smoothing and zero layout shifts.",
    tags: ["Lenis Physics", "Next/Image Responsive", "Micro-Interactions", "Sub-pixel Grid"],
    specs: {
      runtime: "Lenis Smooth Scroll",
      renderTarget: "Next/Image Responsive",
      layoutStability: "CLS = 0.00",
      threadIsolation: "Font Preload Zero-FOUT",
    },
    palette: {
      gradient: "from-cyan-950/40 via-zinc-900 to-zinc-950",
      border: "hover:border-cyan-500/50",
      accent: "text-cyan-400",
    },
    details: [
      "100% viewport aspect-ratio reservations eliminating CLS completely",
      "Progressive font-loading swap strategy with zero FOUT",
      "Lenis multi-touch normalization calibrated for trackpads & mice",
    ],
  },
  {
    id: "neura-kinetics",
    title: "NEURA KINETICS",
    client: "Concept Prototype // Telemetry Systems",
    category: "High-Frequency Telemetry",
    year: "2026",
    description: "Sub-second telemetry visualizer for autonomous motorsport prototypes. Edge-streamed sensor data mapped to kinetic SVG instruments.",
    tags: ["Vercel Edge API", "Real-Time Telemetry", "144Hz Displays", "Tailwind CSS"],
    specs: {
      runtime: "Vercel Edge API",
      renderTarget: "Hardware Composite",
      layoutStability: "CLS = 0.00",
      threadIsolation: "Adaptive RAF Throttle",
    },
    palette: {
      gradient: "from-violet-950/40 via-zinc-900 to-zinc-950",
      border: "hover:border-violet-500/50",
      accent: "text-violet-400",
    },
    details: [
      "Sub-10ms response loop for real-time sensor packets",
      "Hardware-accelerated CSS composite layers for zero GPU bottlenecks",
      "Adaptive frame-rate fallback when low-power mode is detected",
    ],
  },
];

export default function WorkPreview() {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // View Transitions API integration with graceful fallback
  const handleOpenModal = (project: Project) => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setActiveModalProject(project);
      });
    } else {
      setActiveModalProject(project);
    }
  };

  const handleCloseModal = () => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setActiveModalProject(null);
      });
    } else {
      setActiveModalProject(null);
    }
  };

  return (
    <section id="work" className="relative py-32 bg-zinc-950 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>SELECTED WORK // CONCEPT FLAGSHIPS</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100">
              Architectural concepts.
            </h2>
          </div>
          <p className="max-w-md text-sm font-sans text-zinc-300 leading-relaxed">
            Concept prototypes created by Alberta Studio demonstrating creative motion, 
            micro-interactions, and 60fps performance architecture.
          </p>
        </div>

        {/* Project Cards List */}
        <div className="space-y-12">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className={`group relative rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-10 transition-all duration-500 ${project.palette.border} hover:bg-zinc-900/70 hover:shadow-2xl overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Showcase Block (Left / Span 7) */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div
                    className={`relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-gradient-to-br ${project.palette.gradient} border border-zinc-800/80 overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-transform duration-700 group-hover:scale-[1.01]`}
                  >
                    {/* Geometric Mesh Graphic (Clean containment without harsh clipping) */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
                    <div className="absolute right-4 bottom-4 w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-zinc-700/25 pointer-events-none" />
                    <div className="absolute right-10 bottom-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-zinc-700/20 pointer-events-none" />

                    {/* Card Top Meta */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                        0{idx + 1} // {project.year} CONCEPT
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-mono text-[11px] text-zinc-300">
                          {project.specs.runtime}
                        </span>
                      </div>
                    </div>

                    {/* Card Center Visual Elements */}
                    <div className="relative z-10 my-auto text-center py-6">
                      <div className="inline-block p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/70 backdrop-blur-sm shadow-xl">
                        <span className="font-syne text-2xl sm:text-3xl font-extrabold tracking-tight text-white block mb-1">
                          {project.title}
                        </span>
                        <p className="font-mono text-xs text-zinc-300 tracking-wider uppercase">
                          {project.category}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom Technical Tags */}
                    <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-zinc-950/90 border border-zinc-800 text-zinc-300">
                        Render: <strong className="text-emerald-400 font-medium">{project.specs.renderTarget}</strong>
                      </span>
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-zinc-950/90 border border-zinc-800 text-zinc-300">
                        {project.specs.layoutStability}
                      </span>
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-zinc-950/90 border border-zinc-800 text-zinc-300">
                        {project.specs.threadIsolation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Editorial Information (Right / Span 5) */}
                <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                        {project.client}
                      </span>
                    </div>

                    <h3 className="font-syne text-2xl sm:text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors mb-4">
                      {project.title}
                    </h3>

                    <p className="text-sm font-sans text-zinc-300 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-800/60">
                    <MagneticButton strength={0.25}>
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-white hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Inspect Architecture</span>
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </MagneticButton>

                    <button
                      onClick={() => handleOpenModal(project)}
                      className="font-mono text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Case details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study Modal Dialog with View Transition support */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-zinc-900 border border-zinc-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-zinc-800">
              <div>
                <span className="font-mono text-xs text-emerald-400 tracking-wider uppercase block mb-1">
                  Architecture &amp; Concept Inspection
                </span>
                <h3 className="font-syne text-2xl font-bold text-white">
                  {activeModalProject.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
              {activeModalProject.description}
            </p>

            <div className="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <h4 className="font-mono text-xs text-zinc-300 uppercase tracking-widest mb-3">
                Technical Architecture Profile
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850">
                  <span className="text-zinc-400 block text-[10px]">RUNTIME</span>
                  <span className="text-emerald-400 font-semibold text-xs">
                    {activeModalProject.specs.runtime}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850">
                  <span className="text-zinc-400 block text-[10px]">RENDER</span>
                  <span className="text-emerald-400 font-semibold text-xs">
                    {activeModalProject.specs.renderTarget}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850">
                  <span className="text-zinc-400 block text-[10px]">LAYOUT</span>
                  <span className="text-emerald-400 font-semibold text-xs">
                    {activeModalProject.specs.layoutStability}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-850">
                  <span className="text-zinc-400 block text-[10px]">ISOLATION</span>
                  <span className="text-zinc-200 font-semibold text-xs">
                    {activeModalProject.specs.threadIsolation}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h4 className="font-mono text-xs text-zinc-300 uppercase tracking-widest mb-2">
                Engineering Highlights
              </h4>
              {activeModalProject.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
