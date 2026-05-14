import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { CtaOutroSlide } from "@/lib/carousel/types";

export function CtaOutro({
  slide,
  theme,
  handle,
}: {
  slide: CtaOutroSlide;
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
        {/* Decorative starburst (Satori-safe: text glyph) */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            color: theme.accent,
            marginBottom: 40,
          }}
        >
          *
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.fonts.display,
            fontSize: 64,
            lineHeight: 1.1,
            color: theme.ink,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            marginBottom: 24,
            alignItems: "center",
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          <div style={{ display: "flex" }}>{slide.hook}</div>
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
              {slide.hookAfter && (
                <span style={{ display: "flex", marginLeft: 12 }}>
                  {slide.hookAfter}
                </span>
              )}
            </div>
          )}
        </div>

        {slide.sub && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 24,
              color: theme.muted,
              marginBottom: 48,
            }}
          >
            {slide.sub}
          </div>
        )}

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            backgroundColor: theme.accent,
            borderRadius: 999,
            padding: "20px 44px",
            fontFamily: theme.fonts.body,
            fontSize: 28,
            color: theme.bg,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {`Comment "${slide.ctaKeyword}" ${slide.ctaPromise}`}
        </div>
      </div>
    </Frame>
  );
}
