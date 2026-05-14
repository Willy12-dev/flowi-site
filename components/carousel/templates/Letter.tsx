import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { LetterSlide } from "@/lib/carousel/types";

export function Letter({
  slide,
  theme,
  handle,
}: {
  slide: LetterSlide;
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
        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.italic,
            fontStyle: "italic",
            fontSize: 44,
            color: theme.accent,
            marginBottom: 36,
            letterSpacing: "-0.01em",
          }}
        >
          {slide.salutation}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontStyle: "italic",
            fontSize: 36,
            lineHeight: 1.4,
            color: theme.ink,
            maxWidth: 860,
            whiteSpace: "pre-wrap",
            letterSpacing: "-0.005em",
          }}
        >
          {slide.body}
        </div>

        {slide.signoff && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: theme.muted,
              letterSpacing: "0.08em",
              marginTop: 48,
            }}
          >
            {slide.signoff}
          </div>
        )}
      </div>
    </Frame>
  );
}
