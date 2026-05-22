import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { NoirCoverSlide } from "@/lib/carousel/types";
import { N, noirColor } from "./noir-shared";
import { Starburst } from "./promptpack-shared";

/**
 * Noir COVER — the fear-hook opening slide of a noir carousel. A dark canvas,
 * an orange starburst, a small eyebrow, and a large multi-line headline that
 * states an alarming, curiosity-opening claim. A muted sub-line sits under it;
 * a swipe cue is pinned to the bottom.
 */
export function NoirCover({
  slide,
}: {
  slide: NoirCoverSlide;
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 84,
          left: 84,
        }}
      >
        <Starburst size={56} color={N.orange} />
        {slide.eyebrow ? (
          <div
            style={{
              display: "flex",
              fontFamily: N.mono,
              fontSize: 20,
              letterSpacing: 3,
              color: N.orange,
              marginTop: 22,
            }}
          >
            {slide.eyebrow.toUpperCase()}
          </div>
        ) : null}
      </div>

      {/* headline — vertically centred hero */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {slide.headline.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 18,
            }}
          >
            {line.map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  fontSize: 88,
                  fontWeight: 800,
                  lineHeight: 1.04,
                  letterSpacing: -2.4,
                  color: noirColor(r.accent),
                }}
              >
                {r.t}
              </div>
            ))}
          </div>
        ))}
      </div>

      {slide.sub ? (
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.4,
            color: N.inkSoft,
            marginTop: 34,
            maxWidth: 820,
          }}
        >
          {slide.sub}
        </div>
      ) : null}

      {/* swipe cue — pinned bottom-left */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: 80,
          left: 84,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: N.mono,
            fontSize: 19,
            letterSpacing: 3,
            color: N.muted,
          }}
        >
          SWIPE
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: N.mono,
            fontSize: 22,
            color: N.orange,
            marginLeft: 14,
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
