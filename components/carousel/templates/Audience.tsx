import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { AudienceSlide } from "@/lib/carousel/types";

export function Audience({
  slide,
  theme,
  handle,
}: {
  slide: AudienceSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {slide.audiences.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  backgroundColor: theme.accent,
                  color: theme.bg,
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "6px 16px",
                  borderRadius: 999,
                  marginBottom: 10,
                }}
              >
                {a.pill}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: theme.ink,
                  maxWidth: 880,
                }}
              >
                {a.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
