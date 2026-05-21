import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { MethodCtaSlide } from "@/lib/carousel/types";
import { MM } from "./method-shared";

/**
 * Method CTA — white paper, comment-to-DM close. Huge "COMMENT [KEYWORD]
 * BELOW" headline, a green underline, the what-you-get lines, a green
 * speech bubble and an arrow. No price — the DM converts.
 */
export function MethodCta({
  slide,
}: {
  slide: MethodCtaSlide;
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
      }}
    >
      {/* Headline + subtext */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 82,
          width: 680,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: -3,
              color: MM.ink,
            }}
          >
            {slide.pre}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: MM.green,
            }}
          >
            {`“${slide.keyword}”`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: -3,
              color: MM.ink,
            }}
          >
            {slide.post}
          </div>
        </div>

        {/* Underline */}
        <div
          style={{
            display: "flex",
            width: 128,
            height: 9,
            borderRadius: 999,
            backgroundColor: MM.green,
            marginTop: 28,
          }}
        />

        {/* Subtext */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
          {slide.card.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: 37,
                fontWeight: 600,
                lineHeight: 1.34,
                color: line.accent ? MM.greenInk : MM.inkSoft,
              }}
            >
              {line.t}
            </div>
          ))}
        </div>
      </div>

      {/* Speech bubble */}
      <div style={{ position: "absolute", right: 120, bottom: 332, display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              width: 300,
              height: 222,
              borderRadius: 50,
              backgroundColor: MM.green,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: 50,
              width: 52,
              height: 52,
              backgroundColor: MM.green,
              borderRadius: 12,
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>

      {/* Arrow pointing to the bubble */}
      <div
        style={{
          position: "absolute",
          left: 296,
          bottom: 486,
          display: "flex",
          transform: "rotate(40deg)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 7,
              height: 116,
              borderRadius: 999,
              backgroundColor: MM.green,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 30,
              height: 30,
              borderStyle: "solid",
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 7,
              borderBottomWidth: 7,
              borderColor: MM.green,
              transform: "rotate(45deg)",
              marginTop: -26,
            }}
          />
        </div>
      </div>
    </div>
  );
}
