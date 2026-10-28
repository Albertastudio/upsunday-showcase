"use client";

import React, { useEffect, useRef, useState } from "react";

interface AlphaVideoLoopProps {
  className?: string;
  size?: number;
}

export default function AlphaVideoLoop({
  className = "",
  size = 220,
}: AlphaVideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user OS setting for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    // Lazy play only when intersecting viewport to protect LCP and CPU budget
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {prefersReducedMotion ? (
        <img
          src="/motion-alpha-poster.png"
          alt="Alberta Studio Monogram"
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      ) : (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster="/motion-alpha-poster.png"
          preload="none"
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none select-none"
          aria-hidden="true"
        >
          <source src="/motion-alpha.webm" type="video/webm; codecs=vp9" />
          <source src="/motion-alpha.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
