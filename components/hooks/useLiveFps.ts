"use client";

import { useState, useEffect } from "react";

export interface FpsData {
  fps: string;
  fpsNum: number;
  history: number[];
}

export function useLiveFps(): string {
  const { fps } = useLiveFpsData();
  return fps;
}

export function useLiveFpsData(): FpsData {
  const [fps, setFps] = useState<string>("60");
  const [fpsNum, setFpsNum] = useState<number>(60);
  const [history, setHistory] = useState<number[]>([60, 60, 60, 60, 60, 60, 60, 60]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = () => {
      const now = performance.now();
      frameCount++;
      const elapsed = now - lastTime;
      if (elapsed >= 500) {
        const measured = Math.round((frameCount * 1000) / elapsed);
        setFps(`${measured}`);
        setFpsNum(measured);
        setHistory((prev) => [...prev.slice(1), measured]);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  return { fps, fpsNum, history };
}
