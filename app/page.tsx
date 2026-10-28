import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import BentoGrid from "@/components/ui/BentoGrid";
import WorkPreview from "@/components/ui/WorkPreview";
import Manifesto from "@/components/ui/Manifesto";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Surgical Fixed Navigation */}
      <Navbar />

      {/* Hero Section with SplitText entrance & Live Telemetry HUD */}
      <Hero />

      {/* Capabilities & Motion Showcase Bento Grid */}
      <BentoGrid />

      {/* Curated Work / Client Flagships */}
      <WorkPreview />

      {/* Philosophy Manifesto with GSAP Scroll Scrub Reveal */}
      <Manifesto />

      {/* Footer with Operations Clocks & Direct CTA */}
      <Footer />
    </main>
  );
}
