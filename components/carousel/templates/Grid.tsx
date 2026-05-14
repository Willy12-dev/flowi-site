import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { GridSlide } from "@/lib/carousel/types";

export function Grid({
  slide,
  theme,
  handle,
}: {
  slide: GridSlide;
  theme: Theme;
  handle: string;
}) {
  const cols = slide.cols ?? 3;
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
            gap: 16,
          }}
        >
          {slide.cards.map((card, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                width: cellWidth(cols),
                minHeight: 200,
                backgroundColor: theme.card,
                borderRadius: 12,
                padding: 24,
                border: `1px solid ${theme.rule}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.mono,
                  fontSize: 16,
                  color: theme.accent,
                  letterSpacing: "0.1em",
                  marginBottom: 14,
                }}
              >
                {card.number}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 22,
                  lineHeight: 1.2,
                  color: theme.cardInk,
                  fontWeight: 600,
                  marginBottom: card.body ? 12 : 0,
                }}
              >
                {card.title}
              </div>
              {card.body && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: theme.fonts.body,
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: theme.muted,
                  }}
                >
                  {card.body}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function cellWidth(cols: number): number {
  // Body width = 1080 - 80 - 80 = 920. Subtract gaps.
  const gap = 16;
  const total = 920 - gap * (cols - 1);
  return Math.floor(total / cols);
}
