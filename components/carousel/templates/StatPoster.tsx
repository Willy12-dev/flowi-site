import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { StatPosterSlide } from "@/lib/carousel/types";

export function StatPoster({
  slide,
  theme,
  handle,
}: {
  slide: StatPosterSlide;
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
          alignItems: "flex-start",
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
              marginBottom: 32,
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        {slide.preStat && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 32,
              color: theme.inkSoft,
              marginBottom: 16,
            }}
          >
            {slide.preStat}
          </div>
        )}

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.display,
            fontSize: 220,
            lineHeight: 0.92,
            color: theme.accent,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          {slide.stat}
        </div>

        {slide.postStat && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.display,
              fontStyle: "italic",
              fontSize: 56,
              color: theme.ink,
              marginTop: 16,
              letterSpacing: "-0.01em",
            }}
          >
            {slide.postStat}
          </div>
        )}

        {slide.body && (
          <div
            style={{
              display: "flex",
              marginTop: 56,
              fontFamily: theme.fonts.body,
              fontSize: 30,
              lineHeight: 1.4,
              color: theme.inkSoft,
              maxWidth: 800,
            }}
          >
            {slide.body}
          </div>
        )}
      </div>
    </Frame>
  );
}
