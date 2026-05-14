import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { StepSlide } from "@/lib/carousel/types";

export function Step({
  slide,
  theme,
  handle,
}: {
  slide: StepSlide;
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
            fontSize: 22,
            color: theme.muted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {slide.stepLabel ?? "STEP"}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontSize: 240,
            color: theme.accent,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          {slide.stepNumber}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontSize: 56,
            color: theme.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          {slide.title}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 28,
            lineHeight: 1.45,
            color: theme.inkSoft,
            maxWidth: 860,
          }}
        >
          {slide.body}
        </div>
      </div>
    </Frame>
  );
}
