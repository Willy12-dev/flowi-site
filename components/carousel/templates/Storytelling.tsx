import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { StorytellingSlide } from "@/lib/carousel/types";

/**
 * Storytelling slide — full-bleed editorial photo with a magazine-style
 * type overlay. The recurring Soul Character (Mira) appears in a different
 * scene per slide while the personal-narrative copy is set in Bodoni Moda
 * — a high-contrast editorial serif — over a directional dark scrim.
 *
 * Typography:
 *   - Bodoni Moda 700 for the narrative copy (size adapts to line length,
 *     producing magazine-style dynamic hierarchy without per-slide tuning)
 *   - Bodoni Moda 700 italic for the signature / attribution line
 *   - DM Sans 500 for bullets + the footer handle
 *
 * Satori constraints honored: every element with children has
 * display: "flex"; the background image is a real <img>; gradient/scrim
 * overlays are sibling <div>s; no textShadow (Satori-unsupported); image
 * src is an absolute URL (root-relative paths don't resolve serverless).
 */

const SERIF = "BodoniModa";
const SERIF_ITALIC = "BodoniModaItalic";
const SANS = "DMSans";

/**
 * Adaptive headline sizing — short, punchy lines render large; longer
 * explanatory lines step down a tier. Gives every slide a natural focal
 * point without hand-tuning each paragraph.
 */
function headlineSize(text: string): number {
  const n = text.length;
  if (n <= 30) return 58;
  if (n <= 62) return 44;
  return 34;
}

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

  // Satori in Vercel's serverless context can't resolve root-relative
  // image paths — it needs an absolute URL to fetch.
  const bgSrc = slide.bgImage.startsWith("/")
    ? `https://useflowi.app${slide.bgImage}`
    : slide.bgImage;

  // Directional scrim — darkens the band the copy sits over so the
  // high-contrast serif hairlines stay legible on any photo.
  const scrim =
    textPosition === "top"
      ? "linear-gradient(180deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.34) 40%, rgba(0,0,0,0.0) 66%)"
      : textPosition === "bottom"
        ? "linear-gradient(180deg, rgba(0,0,0,0.0) 38%, rgba(0,0,0,0.40) 66%, rgba(0,0,0,0.84) 100%)"
        : "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0.12) 64%, rgba(0,0,0,0.62) 100%)";

  // Vertical anchor for the overlay text block.
  const blockPosition: React.CSSProperties =
    textPosition === "top"
      ? { top: 112 }
      : textPosition === "bottom"
        ? { bottom: 232 }
        : { top: 396 };

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
        fontFamily: SERIF,
      }}
    >
      {/* Full-bleed photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgSrc}
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

      {/* Overall warm wash — unifies the photo, deepens the mood */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          backgroundColor: "rgba(24,18,14,0.20)",
        }}
      />

      {/* Directional scrim for text legibility */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          backgroundImage: scrim,
        }}
      />

      {/* Always-on footer scrim so the handle + dots read on any photo */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: W,
          height: 210,
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Text overlay block */}
      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          ...blockPosition,
          display: "flex",
          flexDirection: "column",
          alignItems: itemsAlign,
          gap: 22,
        }}
      >
        {/* Editorial kicker rule — small brand-accent hairline */}
        <div
          style={{
            display: "flex",
            width: 52,
            height: 3,
            backgroundColor: theme.accent,
          }}
        />

        {slide.paragraphs.map((p, i) => (
          <div
            key={`p${i}`}
            style={{
              display: "flex",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: headlineSize(p),
              lineHeight: 1.28,
              color: "#FBF8F2",
              textAlign,
              maxWidth: 870,
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
              gap: 18,
              marginTop: 12,
              alignItems: "flex-start",
            }}
          >
            {slide.bullets.map((b, i) => (
              <div
                key={`b${i}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 16,
                  maxWidth: 820,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 9,
                    height: 9,
                    borderRadius: 2,
                    backgroundColor: theme.accent,
                    marginTop: 14,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: 30,
                    lineHeight: 1.42,
                    color: "#F2ECE2",
                  }}
                >
                  {b}
                </div>
              </div>
            ))}
          </div>
        )}

        {slide.attribution && (
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontFamily: SERIF_ITALIC,
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 27,
              color: "rgba(251,248,242,0.82)",
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
          bottom: 54,
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
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 17,
            letterSpacing: 2.6,
            color: "rgba(255,255,255,0.66)",
            marginBottom: 14,
          }}
        >
          {handle.toUpperCase()}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {Array.from({ length: slide.total }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor:
                  i + 1 === slide.index
                    ? theme.accent
                    : "rgba(255,255,255,0.34)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
