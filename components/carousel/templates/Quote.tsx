import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { QuoteSlide } from "@/lib/carousel/types";

export function Quote({
  slide,
  theme,
  handle,
}: {
  slide: QuoteSlide;
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
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.italic,
            fontStyle: "italic",
            fontSize: 64,
            lineHeight: 1.18,
            color: theme.ink,
            letterSpacing: "-0.015em",
            maxWidth: 880,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {`"${slide.quote}"`}
        </div>

        {slide.attribution && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: theme.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 56,
            }}
          >
            {`— ${slide.attribution}`}
          </div>
        )}
      </div>
    </Frame>
  );
}
