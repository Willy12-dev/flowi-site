import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { FakeTweetSlide } from "@/lib/carousel/types";

export function FakeTweet({
  slide,
  theme,
  handle,
}: {
  slide: FakeTweetSlide;
  theme: Theme;
  handle: string;
}) {
  // Use a near-white "card" regardless of theme — tweet cards always read on
  // a near-white background. The frame's own bg shows through outside.
  const cardBg = "#FFFFFF";
  const cardInk = "#0F1419";
  const cardMuted = "#536471";
  const accent = "#1D9BF0";

  // Avatar initial: first letter of author
  const initial = slide.author.trim().slice(0, 1).toUpperCase() || "*";

  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: cardBg,
            borderRadius: 22,
            padding: 36,
            width: 880,
            boxShadow: "0 18px 44px rgba(0,0,0,0.10)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: accent,
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontFamily: theme.fonts.body,
                fontSize: 30,
                fontWeight: 600,
                marginRight: 16,
              }}
            >
              {initial}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 24,
                  color: cardInk,
                  fontWeight: 600,
                }}
              >
                {slide.author}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  color: cardMuted,
                }}
              >
                {slide.handle.startsWith("@") ? slide.handle : `@${slide.handle}`}
              </div>
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.body,
              fontSize: 30,
              lineHeight: 1.32,
              color: cardInk,
              marginBottom: 22,
              whiteSpace: "pre-wrap",
            }}
          >
            {slide.body}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              gap: 18,
              fontFamily: theme.fonts.body,
              fontSize: 18,
              color: cardMuted,
              borderTop: `1px solid #EFF3F4`,
              paddingTop: 18,
            }}
          >
            {slide.timestamp && (
              <div style={{ display: "flex" }}>{slide.timestamp}</div>
            )}
            {slide.likes && (
              <div style={{ display: "flex" }}>{`${slide.likes} likes`}</div>
            )}
            {slide.reposts && (
              <div style={{ display: "flex" }}>{`${slide.reposts} reposts`}</div>
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}
