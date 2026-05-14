import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { StatsSlide } from "@/lib/carousel/types";

export function Stats({
  slide,
  theme,
  handle,
}: {
  slide: StatsSlide;
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
            fontSize: 60,
            lineHeight: 1.05,
            color: theme.ink,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            marginBottom: 56,
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
            flexDirection: "column",
            gap: 28,
          }}
        >
          {slide.stats.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                borderBottom:
                  i === slide.stats.length - 1
                    ? "none"
                    : `1px dashed ${theme.rule}`,
                paddingBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.display,
                  fontSize: 96,
                  fontWeight: 700,
                  color: theme.accent,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  width: 320,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 26,
                  color: theme.inkSoft,
                  flex: 1,
                  lineHeight: 1.3,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {slide.footer && (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontFamily: theme.fonts.body,
              fontStyle: "italic",
              fontSize: 22,
              color: theme.muted,
            }}
          >
            {slide.footer}
          </div>
        )}
      </div>
    </Frame>
  );
}
