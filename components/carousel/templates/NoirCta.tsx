import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { NoirCtaSlide } from "@/lib/carousel/types";
import { N, noirColor } from "./noir-shared";
import { Starburst } from "./promptpack-shared";

/**
 * Noir CTA — the product-reveal closer of a noir carousel. A reframing
 * headline, a bridge line, a bordered product card, and a comment-to-DM CTA.
 * The first slide that names a product — value carried the deck, this converts.
 */
export function NoirCta({
  slide,
  handle,
}: {
  slide: NoirCtaSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        width: 1080,
        height: 1350,
        backgroundColor: N.bg,
        fontFamily: N.sans,
        paddingLeft: 84,
        paddingRight: 84,
      }}
    >
      {/* brand mark — pinned top-left */}
      <div style={{ display: "flex", position: "absolute", top: 84, left: 84 }}>
        <Starburst size={56} color={N.orange} />
      </div>

      {/* headline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {slide.headline.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {line.map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  fontSize: 66,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: -1.9,
                  color: noirColor(r.accent),
                }}
              >
                {r.t}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* bridge */}
      {slide.bridge ? (
        <div
          style={{
            display: "flex",
            fontSize: 27,
            fontWeight: 400,
            lineHeight: 1.45,
            color: N.inkSoft,
            marginTop: 28,
            maxWidth: 850,
          }}
        >
          {slide.bridge}
        </div>
      ) : null}

      {/* product card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: N.panel,
          borderRadius: 16,
          borderLeftWidth: 6,
          borderLeftStyle: "solid",
          borderLeftColor: N.orange,
          paddingTop: 26,
          paddingBottom: 28,
          paddingLeft: 32,
          paddingRight: 32,
          marginTop: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: N.mono,
            fontSize: 17,
            letterSpacing: 2,
            color: N.muted,
          }}
        >
          {(slide.productLabel ?? "FLOWI · FIELD GUIDE").toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: -0.9,
            lineHeight: 1.12,
            color: N.ink,
            marginTop: 10,
          }}
        >
          {slide.product}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 38,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 800,
            color: N.ink,
          }}
        >
          Comment
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 800,
            color: N.orange,
            marginLeft: 14,
          }}
        >
          {`"${slide.keyword}"`}
        </div>
      </div>
      {slide.ctaNote ? (
        <div
          style={{
            display: "flex",
            fontSize: 29,
            fontWeight: 400,
            lineHeight: 1.4,
            color: N.inkSoft,
            marginTop: 12,
            maxWidth: 830,
          }}
        >
          {slide.ctaNote}
        </div>
      ) : null}

      {/* handle — pinned bottom-left */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 64,
          left: 84,
          fontFamily: N.mono,
          fontSize: 19,
          letterSpacing: 2,
          color: N.muted,
        }}
      >
        {handle}
      </div>
    </div>
  );
}
