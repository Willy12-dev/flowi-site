import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { HighlightCoverSlide } from "@/lib/carousel/types";

/**
 * The condensed-bold-sans cover with a rectangular highlight box around the
 * key phrase. Inspired by finance/educational Instagram posters
 * (e.g. "HOW MANY BANK ACCOUNTS A COUPLE SHOULD HAVE?" — red rectangle).
 */
export function HighlightCover({
  slide,
  theme,
  handle,
}: {
  slide: HighlightCoverSlide;
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
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 38,
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        {/* Highlight rectangle around the key hook */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            backgroundColor: theme.accent,
            color: theme.bg,
            fontFamily: theme.fonts.body,
            fontWeight: 600,
            fontSize: 86,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            padding: "12px 22px",
            marginBottom: slide.followUp ? 22 : 32,
            textTransform: "uppercase",
          }}
        >
          {slide.highlightedHook}
        </div>

        {slide.followUp && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontWeight: 600,
              fontSize: 64,
              lineHeight: 1.04,
              color: theme.ink,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              marginBottom: 36,
              maxWidth: 920,
            }}
          >
            {slide.followUp}
          </div>
        )}

        {slide.sub && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 28,
              lineHeight: 1.4,
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
