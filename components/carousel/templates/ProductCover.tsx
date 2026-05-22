import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { ProductCoverSlide } from "@/lib/carousel/types";
import { MM, runColor } from "./method-shared";
import { Starburst } from "./promptpack-shared";

/**
 * Product COVER — a clean, centred typographic cover for a digital product
 * (Gumroad listings, field guides). White paper, bold Inter display, the
 * Claude-orange / Higgsfield-green accent system.
 *
 * Rendered on the standard 1080×1350 canvas, but all content is centred
 * inside the middle 1080×1080 square — so a centre-crop yields a clean
 * square thumbnail with no design rework.
 */
export function ProductCover({
  slide,
}: {
  slide: ProductCoverSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        backgroundColor: MM.paper,
        position: "relative",
        fontFamily: MM.sans,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      {/* Brand mark */}
      <Starburst size={64} color={MM.orange} />

      {/* Eyebrow */}
      {slide.eyebrow ? (
        <div
          style={{
            display: "flex",
            fontFamily: MM.mono,
            fontSize: 22,
            letterSpacing: 3,
            color: MM.muted,
            marginTop: 30,
          }}
        >
          {slide.eyebrow.toUpperCase()}
        </div>
      ) : null}

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 26,
        }}
      >
        {slide.title.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 18,
            }}
          >
            {line.map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  fontSize: 118,
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: -2.5,
                  color: runColor(r.accent),
                }}
              >
                {r.t}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Accent rule */}
      <div
        style={{
          display: "flex",
          width: 66,
          height: 5,
          borderRadius: 999,
          backgroundColor: MM.orange,
          marginTop: 36,
        }}
      />

      {/* Subtitle */}
      {slide.subtitle ? (
        <div
          style={{
            display: "flex",
            fontFamily: MM.sans,
            fontSize: 31,
            fontWeight: 400,
            lineHeight: 1.4,
            color: MM.inkSoft,
            textAlign: "center",
            marginTop: 32,
            maxWidth: 760,
          }}
        >
          {slide.subtitle}
        </div>
      ) : null}

      {/* Footer */}
      {slide.footer ? (
        <div
          style={{
            display: "flex",
            fontFamily: MM.mono,
            fontSize: 21,
            letterSpacing: 2,
            color: MM.muted,
            marginTop: 46,
          }}
        >
          {slide.footer}
        </div>
      ) : null}
    </div>
  );
}
