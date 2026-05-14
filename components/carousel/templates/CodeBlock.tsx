import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { CodeBlockSlide } from "@/lib/carousel/types";

export function CodeBlock({
  slide,
  theme,
  handle,
}: {
  slide: CodeBlockSlide;
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
            fontFamily: theme.fonts.display,
            fontSize: 56,
            lineHeight: 1.1,
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
            flexDirection: "column",
            flex: 1,
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: "40px 44px",
            border: `1px solid ${theme.rule}`,
          }}
        >
          {slide.language && (
            <div
              style={{
                display: "flex",
                fontFamily: theme.fonts.mono,
                fontSize: 16,
                color: theme.muted,
                marginBottom: 20,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {slide.language}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 24,
              lineHeight: 1.55,
              color: theme.cardInk,
              whiteSpace: "pre-wrap",
            }}
          >
            {slide.code}
          </div>
        </div>

        {slide.caption && (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: theme.muted,
              fontStyle: "italic",
            }}
          >
            {slide.caption}
          </div>
        )}
      </div>
    </Frame>
  );
}
