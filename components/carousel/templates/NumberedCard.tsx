import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { NumberedCardSlide } from "@/lib/carousel/types";

export function NumberedCard({
  slide,
  theme,
  handle,
}: {
  slide: NumberedCardSlide;
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
            fontFamily: theme.fonts.mono,
            fontSize: 28,
            color: theme.accent,
            marginBottom: 30,
            letterSpacing: "0.08em",
          }}
        >
          {`${slide.number} ·`}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontSize: 64,
            lineHeight: 1.08,
            color: theme.ink,
            letterSpacing: "-0.02em",
            marginBottom: 40,
            fontWeight: 700,
          }}
        >
          {slide.title}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 30,
            lineHeight: 1.45,
            color: theme.inkSoft,
            maxWidth: 880,
          }}
        >
          {slide.body}
        </div>
      </div>
    </Frame>
  );
}
