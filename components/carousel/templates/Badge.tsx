import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { BadgeSlide } from "@/lib/carousel/types";

export function Badge({
  slide,
  theme,
  handle,
}: {
  slide: BadgeSlide;
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
            gap: 14,
          }}
        >
          {slide.badges.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.card,
                border: `1px solid ${theme.rule}`,
                borderRadius: 14,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 24,
                  fontWeight: 600,
                  color: theme.cardInk,
                  marginBottom: b.sub ? 6 : 0,
                }}
              >
                {b.label}
              </div>
              {b.sub && (
                <div
                  style={{
                    display: "flex",
                    fontFamily: theme.fonts.body,
                    fontSize: 16,
                    color: theme.muted,
                  }}
                >
                  {b.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
