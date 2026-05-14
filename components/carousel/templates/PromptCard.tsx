import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { PromptCardSlide } from "@/lib/carousel/types";

export function PromptCard({
  slide,
  theme,
  handle,
}: {
  slide: PromptCardSlide;
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
              letterSpacing: "0.14em",
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
            flexDirection: "column",
            fontFamily: theme.fonts.italic,
            fontStyle: "italic",
            fontSize: 72,
            color: theme.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex" }}>{slide.title}</div>
          {slide.italicWord && (
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex", color: theme.accent }}>
                {slide.italicWord}
              </span>
            </div>
          )}
        </div>

        {slide.intro && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 26,
              color: theme.inkSoft,
              maxWidth: 880,
              marginBottom: 32,
              lineHeight: 1.4,
            }}
          >
            {slide.intro}
          </div>
        )}

        {/* Mock chat input card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.card,
            borderRadius: 18,
            padding: "26px 28px",
            border: `1px solid ${theme.rule}`,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: theme.muted,
              marginBottom: 16,
            }}
          >
            {slide.inputPlaceholder}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {slide.commands.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: theme.bg,
                  borderRadius: 999,
                  padding: "8px 16px",
                  border: `1px solid ${theme.rule}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: theme.fonts.mono,
                    fontSize: 16,
                    color: theme.accent,
                    marginRight: 8,
                  }}
                >
                  {c.slash}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: theme.fonts.body,
                    fontSize: 18,
                    color: theme.cardInk,
                  }}
                >
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
