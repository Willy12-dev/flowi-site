import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { NoirProblemSlide } from "@/lib/carousel/types";
import { N, noirColor } from "./noir-shared";

/**
 * Noir PROBLEM — a numbered slide of a noir carousel. A big orange number, an
 * all-caps headline, a few short statement lines, a short orange rule, and a
 * quiet takeaway. Used to escalate the emotional case one slide at a time.
 */
export function NoirProblem({
  slide,
  handle,
}: {
  slide: NoirProblemSlide;
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
      {/* ghost watermark number — fills the canvas with editorial weight */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 780,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -10,
            color: "#2F2A20",
          }}
        >
          {slide.number}
        </div>
      </div>

      {/* number + headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: 999,
            backgroundColor: N.orange,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 800,
              color: N.bg,
            }}
          >
            {slide.number}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 28,
          }}
        >
          {slide.headline.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              {line.map((r, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    fontSize: 62,
                    fontWeight: 800,
                    lineHeight: 1.04,
                    letterSpacing: -1.8,
                    color: noirColor(r.accent),
                  }}
                >
                  {r.t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* body statement lines */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 46 }}>
        {slide.lines.map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              fontSize: 33,
              fontWeight: 600,
              lineHeight: 1.4,
              color: N.ink,
              marginTop: i === 0 ? 0 : 16,
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* rule */}
      <div
        style={{
          display: "flex",
          width: 116,
          height: 4,
          borderRadius: 999,
          backgroundColor: N.orange,
          marginTop: 40,
          marginBottom: 32,
        }}
      />

      {/* takeaway */}
      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1.4,
          color: N.inkSoft,
          maxWidth: 880,
        }}
      >
        {slide.takeaway}
      </div>

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
