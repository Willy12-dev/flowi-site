import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { StorytellingSlide } from "@/lib/carousel/types";

/**
 * Storytelling slide — full-bleed photo background with a white-serif
 * paragraph overlay. The Ava-style transformation carousel format: the
 * recurring persona (Soul Character) appears in a different scene per
 * slide while personal-narrative copy reads cleanly over a soft dark
 * gradient.
 *
 * Satori constraints honored: every element with multiple children has
 * display: "flex"; the background image is a real <img> (not CSS bg);
 * gradient overlays are sibling <div>s with linear-gradient.
 */
export function Storytelling({
  slide,
  theme,
  handle,
}: {
  slide: StorytellingSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;

  const textPosition = slide.textPosition ?? "top";
  const textAlign = slide.textAlign ?? "center";

  // Gradient is positioned to darken the area the text sits over, so the
  // copy stays legible against any photographic background.
  const gradient =
    textPosition === "top"
      ? "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 55%)"
      : textPosition === "bottom"
        ? "linear-gradient(180deg, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.62) 100%)"
        : "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 65%, rgba(0,0,0,0.35) 100%)";

  // Vertical position for the overlay text block.
  const textBlockPosition: React.CSSProperties =
    textPosition === "top"
      ? { top: 120 }
      : textPosition === "bottom"
        ? { bottom: 220 }
        : { top: 380 };

  const itemsAlign =
    textAlign === "left"
      ? "flex-start"
      : textAlign === "right"
        ? "flex-end"
        : "center";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        backgroundColor: "#1a1714",
        position: "relative",
        padding: 0,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Full-bleed photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.bgImage}
        alt=""
        width={W}
        height={H}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          objectFit: "cover",
        }}
      />

      {/* Soft dark gradient overlay for text legibility */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          display: "flex",
          backgroundImage: gradient,
        }}
      />

      {/* Text overlay block */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          ...textBlockPosition,
          display: "flex",
          flexDirection: "column",
          alignItems: itemsAlign,
          gap: 26,
        }}
      >
        {slide.paragraphs.map((p, i) => (
          <div
            key={`p${i}`}
            style={{
              display: "flex",
              fontFamily: theme.fonts.italic,
              fontStyle: "italic",
              fontSize: 40,
              lineHeight: 1.32,
              color: "#fff",
              textAlign,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              maxWidth: 900,
            }}
          >
            {p}
          </div>
        ))}

        {slide.bullets && slide.bullets.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 10,
              alignItems: itemsAlign,
            }}
          >
            {slide.bullets.map((b, i) => (
              <div
                key={`b${i}`}
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.italic,
                  fontStyle: "italic",
                  fontSize: 32,
                  lineHeight: 1.32,
                  color: "#fff",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  maxWidth: 880,
                }}
              >
                • {b}
              </div>
            ))}
          </div>
        )}

        {slide.attribution && (
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontFamily: theme.fonts.italic,
              fontStyle: "italic",
              fontSize: 28,
              color: "rgba(255,255,255,0.88)",
              textShadow: "0 2px 8px rgba(0,0,0,0.55)",
            }}
          >
            {slide.attribution}
          </div>
        )}
      </div>

      {/* Handle + progress dots in footer */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 20,
            color: "rgba(255,255,255,0.65)",
            textShadow: "0 1px 4px rgba(0,0,0,0.55)",
            marginBottom: 14,
          }}
        >
          {handle}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: slide.total }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i + 1 === slide.index ? theme.accent : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
