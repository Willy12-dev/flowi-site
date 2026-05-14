import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { CompareSlide } from "@/lib/carousel/types";

export function Compare({
  slide,
  theme,
  handle,
}: {
  slide: CompareSlide;
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
            fontSize: 60,
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

        <div style={{ display: "flex", flex: 1, gap: 22 }}>
          <CompareCard
            theme={theme}
            label={slide.left.label}
            items={slide.left.items}
            tone="muted"
          />
          <CompareCard
            theme={theme}
            label={slide.right.label}
            items={slide.right.items}
            tone="accent"
          />
        </div>
      </div>
    </Frame>
  );
}

function CompareCard({
  theme,
  label,
  items,
  tone,
}: {
  theme: Theme;
  label: string;
  items: string[];
  tone: "muted" | "accent";
}) {
  const isAccent = tone === "accent";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: theme.card,
        borderRadius: 14,
        padding: 28,
        border: `2px solid ${isAccent ? theme.accent : theme.rule}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: theme.fonts.mono,
          fontSize: 18,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: isAccent ? theme.accent : theme.muted,
          marginBottom: 22,
        }}
      >
        {label}
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 24,
            lineHeight: 1.35,
            color: theme.cardInk,
            marginBottom: 14,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: isAccent ? theme.accent : theme.muted,
              marginRight: 12,
              marginTop: 2,
            }}
          >
            {isAccent ? "+" : "-"}
          </div>
          <div style={{ display: "flex", flex: 1 }}>{it}</div>
        </div>
      ))}
    </div>
  );
}
