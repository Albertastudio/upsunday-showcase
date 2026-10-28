"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";

interface TypewriterSubtitleProps {
  text?: string;
  className?: string;
  startDelay?: number;
}

const DEFAULT_TEXT =
  "Digital flagships engineered for design-led companies. Every transition is timed to 16.6ms frame budgets, rendered with zero layout shift (CLS = 0.00), and compiled for sub-second LCP.";

export default function TypewriterSubtitle({
  text = DEFAULT_TEXT,
  className = "",
  startDelay = 450,
}: TypewriterSubtitleProps) {
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);
  const containerRef = useRef<HTMLParagraphElement>(null);

  // Pre-calculate words, characters, and breaking spaces with sequential global indices
  const { words, totalChars } = useMemo(() => {
    let counter = 0;
    const wordList = text.split(" ").map((wordStr, wordIdx, arr) => {
      const chars = wordStr.split("").map((char) => {
        const index = counter++;
        return { char, index };
      });
      const spaceIndex = wordIdx < arr.length - 1 ? counter++ : null;
      return {
        wordStr,
        wordIdx,
        chars,
        spaceIndex,
      };
    });
    return { words: wordList, totalChars: counter };
  }, [text]);

  // Terminal-grade typewriter animation loop with natural cadence and emerald glint
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisibleCount(totalChars);
      setIsComplete(true);
      setCursorVisible(false);
      return;
    }

    let isCancelled = false;
    let timerId: NodeJS.Timeout;

    const runTypewriter = () => {
      let current = 0;

      const typeStep = () => {
        if (isCancelled) return;
        current += 1;
        setVisibleCount(current);

        if (current >= totalChars) {
          setIsComplete(true);
          // Let cursor blink gently after completion, then smoothly fade out
          setTimeout(() => {
            if (!isCancelled) {
              setCursorVisible(false);
            }
          }, 2400);
          return;
        }

        // Determine natural rhythmic cadence for realistic typing
        const lastChar = text[current - 1] || "";
        let delay = 26; // balanced typing speed (~38 chars/sec)

        if (lastChar === "." || lastChar === "!") {
          delay = 190; // contemplative pause after full stops
        } else if (lastChar === "," || lastChar === ";") {
          delay = 110; // breathing pause after commas
        } else if (lastChar === ")" || lastChar === "(") {
          delay = 75; // punctuation micro-pause
        } else if (lastChar === " ") {
          delay = 36; // natural word boundary spacing
        } else {
          // Subtle organic micro-jitter (22ms - 32ms)
          delay = 22 + ((current * 11) % 11);
        }

        timerId = setTimeout(typeStep, delay);
      };

      timerId = setTimeout(typeStep, startDelay);
    };

    runTypewriter();

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [totalChars, text, startDelay]);

  // Click on text to fast-forward to the end
  const handleFastForward = () => {
    if (!isComplete) {
      setVisibleCount(totalChars);
      setIsComplete(true);
      setCursorVisible(false);
    }
  };

  return (
    <div className="relative">
      {/* Screen reader & SEO indexer: unfragmented complete text */}
      <p className="sr-only">{text}</p>

      {/* Visual zero-CLS paragraph: all spans exist in the layout flow from frame 0 */}
      <p
        ref={containerRef}
        onClick={handleFastForward}
        aria-hidden="true"
        className={`text-base sm:text-lg md:text-xl text-zinc-400 font-sans leading-relaxed tracking-tight relative cursor-default select-text ${className}`}
      >
        {/* Initial cursor waiting at the very start before the first keystroke */}
        {visibleCount === 0 && cursorVisible && (
          <span className="relative inline-block w-0 h-0 overflow-visible pointer-events-none select-none">
            <span className="absolute top-[0.12em] -left-[1px] w-[2px] sm:w-[2.5px] h-[1.15em] bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_16px_rgba(16,185,129,0.7)] rounded-full animate-pulse" />
          </span>
        )}

        {words.map(({ wordIdx, chars, spaceIndex }) => (
          <React.Fragment key={wordIdx}>
            <span className="inline-block whitespace-nowrap">
              {chars.map(({ char, index }) => {
                const isRevealed = index < visibleCount;
                const isCurrent = index === visibleCount - 1;
                const diff = visibleCount - 1 - index;

                // Color & glow transition: newly typed characters glow electric emerald,
                // followed by a decaying emerald phosphor trail (approx 1-2 words),
                // smoothly settling into resting zinc-400 via hardware-accelerated CSS transition.
                let charColor = "rgb(161 161 170)"; // text-zinc-400
                let charShadow = "none";
                let charScale = "scale(1)";

                if (isRevealed && !isComplete) {
                  if (diff === 0) {
                    charColor = "rgb(52 211 153)"; // emerald-400 (bright active lead)
                    charShadow =
                      "0 0 10px rgba(52, 211, 153, 1), 0 0 22px rgba(16, 185, 129, 0.6)";
                    charScale = "scale(1.05)";
                  } else if (diff <= 2) {
                    charColor = "rgb(16 185 129)"; // emerald-500
                    charShadow =
                      "0 0 8px rgba(16, 185, 129, 0.75), 0 0 14px rgba(5, 150, 105, 0.35)";
                  } else if (diff <= 6) {
                    charColor = "rgb(52 211 153 / 0.85)"; // emerald-400 phosphor
                    charShadow = "0 0 6px rgba(16, 185, 129, 0.4)";
                  } else if (diff <= 10) {
                    charColor = "rgb(110 231 183 / 0.65)"; // emerald-300 fading
                    charShadow = "0 0 3px rgba(110, 231, 183, 0.2)";
                  }
                }

                return (
                  <React.Fragment key={index}>
                    <span
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        color: charColor,
                        textShadow: charShadow,
                        transform: charScale,
                        transition:
                          "color 650ms cubic-bezier(0.16, 1, 0.3, 1), text-shadow 650ms ease, transform 200ms ease, opacity 80ms ease",
                      }}
                      className="inline-block origin-center will-change-[color,transform]"
                    >
                      {char}
                    </span>

                    {/* Zero-width cursor immediately after the active character */}
                    {isCurrent && cursorVisible && (
                      <span className="relative inline-block w-0 h-0 overflow-visible pointer-events-none select-none">
                        <span
                          className={`absolute top-[0.12em] left-[1px] w-[2px] sm:w-[2.5px] h-[1.15em] bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_16px_rgba(16,185,129,0.7)] rounded-full ${
                            isComplete
                              ? "transition-opacity duration-700"
                              : "animate-pulse"
                          }`}
                          style={{ opacity: cursorVisible ? 1 : 0 }}
                        />
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </span>

            {/* Standard breaking space between words */}
            {spaceIndex !== null && (
              <React.Fragment key={`space-${spaceIndex}`}>
                <span
                  style={{
                    opacity: spaceIndex < visibleCount ? 1 : 0,
                  }}
                >
                  {" "}
                </span>

                {/* If space is the current active char, render cursor after space */}
                {spaceIndex === visibleCount - 1 && cursorVisible && (
                  <span className="relative inline-block w-0 h-0 overflow-visible pointer-events-none select-none">
                    <span
                      className={`absolute top-[0.12em] left-0 w-[2px] sm:w-[2.5px] h-[1.15em] bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_16px_rgba(16,185,129,0.7)] rounded-full ${
                        isComplete
                          ? "transition-opacity duration-700"
                          : "animate-pulse"
                      }`}
                      style={{ opacity: cursorVisible ? 1 : 0 }}
                    />
                  </span>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
