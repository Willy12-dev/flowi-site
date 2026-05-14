import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { CoverSlide } from "@/lib/carousel/types";

export function Cover({
  slide,
  theme,
  handle,
}: {
  slide: CoverSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {slide.eyebrow && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: theme.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 36,
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
            fontSize: 116,
            lineHeight: 1.02,
            color: theme.ink,
            letterSpacing: "-0.025em",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <span style={{ display: "flex" }}>{slide.headline}</span>
          </div>
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
              {slide.headlineAfter && (
                <span style={{ display: "flex", marginLeft: 14 }}>
                  {slide.headlineAfter}
                </span>
              )}
            </div>
          )}
        </div>

        {slide.sub && (
          <div
            style={{
              display: "flex",
              marginTop: 56,
              fontFamily: theme.fonts.body,
              fontSize: 32,
              lineHeight: 1.35,
              color: theme.inkSoft,
              maxWidth: 800,
            }}
          >
            {slide.sub}
          </div>
        )}
      </div>
    </Frame>
  );
}
