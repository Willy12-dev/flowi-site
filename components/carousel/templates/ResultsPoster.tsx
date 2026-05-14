import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { ResultsPosterSlide } from "@/lib/carousel/types";

/**
 * The "I gave Claude my Instagram page. 1.5M views. $6,783." style.
 * 2–3 oversized result chips, then optional CTA line.
 */
export function ResultsPoster({
  slide,
  theme,
  handle,
}: {
  slide: ResultsPosterSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {slide.eyebrow && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              color: theme.accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.fonts.display,
            fontSize: 64,
            lineHeight: 1.05,
            color: theme.ink,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          <div style={{ display: "flex" }}>{slide.title}</div>
          {slide.italicWord && (
            <div style={{ display: "flex" }}>
              <span
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.italic,
                  fontStyle: "italic",
                  color: theme.accent,
                }}
              >
                {slide.italicWord}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          {slide.results.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                backgroundColor: theme.accent,
                color: theme.bg,
                borderRadius: 22,
                padding: "26px 32px",
                minWidth: 260,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.display,
                  fontSize: 76,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              >
                {r.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
              >
                {r.label}
              </div>
            </div>
          ))}
        </div>

        {slide.cta && (
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontFamily: theme.fonts.display,
              fontStyle: "italic",
              fontSize: 36,
              color: theme.ink,
              letterSpacing: "-0.01em",
              maxWidth: 880,
            }}
          >
            {slide.cta}
          </div>
        )}
      </div>
    </Frame>
  );
}
