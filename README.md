# Alberta Studio — Design System & 3D Showcase (R&D)

> **Live Production Hub:** [https://www.albertastudio.dev](https://www.albertastudio.dev)  
> **Repository Role:** R&D Design Prototype & Visual Benchmarking Sandbox

---

## 🏛️ About This Project

This repository serves as an exploratory engineering and design prototype (R&D sandbox) for **[Alberta Studio](https://www.albertastudio.dev)**, an independent Canadian software studio based in Calgary, Alberta. It was created to craft and test the studio's next-generation digital flagship identity: a dark graphite aesthetic (`#09090b`), emerald accent palette (`#10b981`), bespoke typographic system, and the sculptural "AS" 3D monogram pipeline (featuring WebGL Bézier curve tracing, PBR brushed titanium materials, and pre-rendered WebM VP9 alpha video loops).

The core design patterns, kinetic typography, Lenis smooth scrolling, and 3D monogram mechanics perfected in this repository have been fully integrated into the live Alberta Studio production hub at **[albertastudio.dev](https://www.albertastudio.dev)**. This showcase repository is retained as an active design reference, experimental sandbox for interactive web experiments, and performance benchmark achieving 100/100 Google Lighthouse scores with zero layout shift (`CLS = 0.000`).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Runtime:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Motion & Kinetic Scroll:** GSAP 3, Lenis (`lenis/react`)
- **3D & Graphics:** Three.js, Canvas 2D/WebGL, Hardware Alpha WebM VP9 & MP4 loops
- **Telemetry:** Live Core Web Vitals telemetry strip (LCP, CLS, INP, FPS)

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Install dependencies
npm ci

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the showcase.

---

## 🌐 Official Links

- **Main Website & Hub:** [https://www.albertastudio.dev](https://www.albertastudio.dev)
- **PrecastForge ERP:** [https://precastforge-client.web.app](https://precastforge-client.web.app)
- **Buildric Contractor Revenue & CRM:** [https://buildric.albertastudio.dev](https://buildric.albertastudio.dev)
- **Crewbric Mobile Field Logs:** [https://crewbric.albertastudio.dev](https://crewbric.albertastudio.dev)
- **Inquiries:** [hello@albertastudio.dev](mailto:hello@albertastudio.dev)
