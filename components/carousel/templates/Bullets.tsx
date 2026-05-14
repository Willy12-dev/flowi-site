import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { BulletsSlide } from "@/lib/carousel/types";

export function Bullets({
  slide,
  theme,
  handle,
}: {
  slide: BulletsSlide;
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
              letterSpacing: "0.12em",
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontFamily: theme.fonts.body,
                fontSize: 28,
                lineHeight: 1.4,
                color: theme.ink,
                marginBottom: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.mono,
                  fontSize: 22,
                  color: theme.accent,
                  marginRight: 18,
                  width: 32,
                  marginTop: 4,
                }}
              >
                {`0${i + 1}`}
              </div>
              <div style={{ display: "flex", flex: 1 }}>{b}</div>
            </div>
          ))}
        </div>

        {slide.footer && (
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: theme.muted,
              fontStyle: "italic",
            }}
          >
            {slide.footer}
          </div>
        )}
      </div>
    </Frame>
  );
}
